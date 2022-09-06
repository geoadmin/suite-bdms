# -*- coding: utf-8 -*-

import asyncio
import json
from tornado.options import options
from bms.v1.borehole.export.full import ZippedFullExport2Storage
from bms.v1.feedback import ForwardFeedback
import traceback

class EventListener():

    actions = [
        'FEEDBACK.CREATE',
        'DATABASE.EXPORT'
    ]

    def __init__(self, application):
        self.application = application
        self.conn = None
    
    async def start(self):
        if self.conn is None:
            self.conn = await self.application.pool.acquire()

        for action in self.actions:
            await self.conn.add_listener(action, self.callback)

    async def stop(self):
        for action in self.actions:
            await self.conn.remove_listener(action, self.callback)

        await self.conn.close()

    async def handleCallback(self, action, payload):

        exe = None
        request = {}

        try:

            id = int(payload)

            if action == 'FEEDBACK.CREATE':
                exe = ForwardFeedback(self.conn)

                # Prepare request
                request = {
                    "feb_id": id,
                    "username": options.smtp_username,
                    "password": options.smtp_password,
                    "recipients": options.smtp_recipients,
                    "server": options.smtp_server,
                    "port": options.smtp_port,
                    "tls": options.smtp_tls,
                    "starttls": options.smtp_starttls,
                }

            elif action == 'DATABASE.EXPORT':
                exe = ZippedFullExport2Storage(self.conn)
                request['id'] = id

            else:
                print(f"Action unknown: {action}")

            if exe is not None:
                print("Running async task..")
                response = await exe.execute(**request)

        except Exception as ex:
            print(traceback.print_exc())

    def callback(self, conn, pid, action, payload):

        if action in self.actions:

            asyncio.create_task(
                self.handleCallback(action, payload)
            )

            # exe = None
            # request = {}

            # if action == 'FEEDBACK.CREATE':
            #     try:
            #         exe = ForwardFeedback(self.conn)

            #         # Extract feedback id from payload
            #         feb_id = int(payload)

            #         # Prepare request
            #         request = {
            #             "feb_id": feb_id,
            #             "username": options.smtp_username,
            #             "password": options.smtp_password,
            #             "recipients": options.smtp_recipients,
            #             "server": options.smtp_server,
            #             "port": options.smtp_port,
            #             "tls": options.smtp_tls,
            #             "starttls": options.smtp_starttls,
            #         }

            #     except Exception as ex:
            #         print(ex)

            # elif action == 'DATABASE.EXPORT':
            #     try:
            #         # exe = ExportSpatiaLite(self.conn)
            #         print('DATABASE.EXPORT:')
            #         print(int(payload))

            #         evn = asyncio.create_task(
            #             conn.fetch(
            #                 """
            #                     SELECT
            #                         id_usr_fk,
            #                         topic_evs,
            #                         created_evs,
            #                         payload_evs

            #                     FROM
            #                         bdms.events

            #                     WHERE
            #                         id_evs = $1

            #                 """, int(payload)
            #             )
            #         )
            #         result_of_task1 = await task1

            #         print('id_evs:')
            #         print(evn[3])

            #     except Exception as ex:
            #         print(ex)

            # else:
            #     print(f"Action unknown: {action}")

            # if exe is not None:
            #     print("Running action.")
            #     asyncio.create_task(
            #         exe.execute(**request)
            #     )

        else:
            print(f"Unknown event action: {action}")
