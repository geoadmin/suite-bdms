# -*- coding: utf-8 -*-
from bms.v1.handlers import Viewer
from tornado.httpclient import (
    AsyncHTTPClient,
    HTTPError,
    HTTPRequest
)


class GetFeature(Viewer):
    
    async def get(self):
        http_client = AsyncHTTPClient()
        lang = self.get_argument('lang', 'en')
        # layer = self.get_argument('layer', None)
        # coords = self.get_argument('coordinates', None)
        
        try:
            self.set_header("Content-Type", "text/xml")

            if 'lang={}' in url:
                url = url.format(lang)
            
            elif 'lang=' not in url:
                url = f'{url}&lang={lang}'

            response = await http_client.fetch(
                HTTPRequest(
                    url=url
                )
            )

            self.write(response.body)

        except HTTPError as e:
            print(" > Error: " + str(e))

        except Exception as e:
            # Other errors are possible, such as IOError.
            print(" > Error: " + str(e))

        http_client.close()
