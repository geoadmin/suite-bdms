# -*- coding: utf-8 -*-
from bms.v1.action import Action


class GetProfile(Action):

    sql = """
        SELECT
            (
                select row_to_json(t)
                FROM (
                    SELECT
                        id_bho as id
                ) t
            ) as borehole,
            id_sty as id,
            stratigraphy.kind_id_cli as kind,
            COALESCE(name_sty, '') as name,
            primary_sty as primary,
            to_char(
                date_sty,
                'YYYY-MM-DD'
            ) as date,
            to_char(
                update_sty,
                'YYYY-MM-DD'
            ) as updated,
            to_char(
                creation_sty,
                'YYYY-MM-DD'
            ) as created

        FROM
            bdms.stratigraphy

        INNER JOIN bdms.borehole
            ON stratigraphy.id_bho_fk = id_bho

        INNER JOIN (
            SELECT
                id_bho_fk,
                array_agg(
                    json_build_object(
                        'workflow', id_wkf,
                        'role', name_rol,
                        'username', username,
                        'started', started,
                        'finished', finished
                    )
                ) as status
            FROM (
                SELECT
                    id_bho_fk,
                    name_rol,
                    id_wkf,
                    username,
                    started_wkf as started,
                    finished_wkf as finished
                FROM
                    bdms.workflow,
                    bdms.roles,
                    bdms.users
                WHERE
                    id_rol = id_rol_fk
                AND
                    id_usr = id_usr_fk
                ORDER BY
                    id_bho_fk asc, id_wkf asc
            ) t
            GROUP BY
                id_bho_fk
        ) as v
        ON
            v.id_bho_fk = id_bho
    """

    async def execute(self, id, user=None):

        permission = ''

        if user is not None:
            permission = """
                AND {}
            """.format(
                self.filterPermission(user)
            )

        kind = await self.conn.fetchval(f"""
            SELECT
                kind_id_cli
            FROM
                bdms.stratigraphy
            WHERE
                id_sty = $1
        """, id)

        sql = GetProfile.sql

        if kind == 3000:
            sql = GetGeologyProfile.sql

        elif kind == 3001:
            sql = GetGeotechnicalProfile.sql

        elif kind == 3002:
            sql = GetCasingProfile.sql

        elif kind == 3003:
            sql = GetInstrumentsProfile.sql

        elif kind == 3004:
            sql = GetFillingProfile.sql

        rec = await self.conn.fetchrow(f"""
            SELECT
                row_to_json(t)
            FROM (
                
                {sql}

                WHERE
                    id_sty = $1

                {permission}
            ) AS t
        """, id)

        return {
            "data": self.decode(rec[0]) if rec[0] is not None else None
        }


class GetGeologyProfile(Action):

    sql = """
        SELECT
            (
                select row_to_json(t)
                FROM (
                    SELECT
                        id_bho as id
                ) t
            ) as borehole,
            id_sty as id,
            stratigraphy.kind_id_cli as kind,
            COALESCE(name_sty, '') as name,
            primary_sty as primary,
            to_char(
                date_sty,
                'YYYY-MM-DD'
            ) as date,
            to_char(
                update_sty,
                'YYYY-MM-DD'
            ) as updated,
            to_char(
                creation_sty,
                'YYYY-MM-DD'
            ) as created

        FROM
            bdms.stratigraphy

        INNER JOIN bdms.borehole
            ON stratigraphy.id_bho_fk = id_bho

        INNER JOIN (
            SELECT
                id_bho_fk,
                array_agg(
                    json_build_object(
                        'workflow', id_wkf,
                        'role', name_rol,
                        'username', username,
                        'started', started,
                        'finished', finished
                    )
                ) as status
            FROM (
                SELECT
                    id_bho_fk,
                    name_rol,
                    id_wkf,
                    username,
                    started_wkf as started,
                    finished_wkf as finished
                FROM
                    bdms.workflow,
                    bdms.roles,
                    bdms.users
                WHERE
                    id_rol = id_rol_fk
                AND
                    id_usr = id_usr_fk
                ORDER BY
                    id_bho_fk asc, id_wkf asc
            ) t
            GROUP BY
                id_bho_fk
        ) as v
        ON
            v.id_bho_fk = id_bho
    """

class GetGeotechnicalProfile(Action):

    sql = GetProfile.sql

class GetCasingProfile(Action):

    sql = """
        SELECT
            (
                select row_to_json(t)
                FROM (
                    SELECT
                        id_bho as id
                ) t
            ) as borehole,
            id_sty as id,
            stratigraphy.kind_id_cli as kind,
            COALESCE(name_sty, '') as name,
            primary_sty as primary,
            to_char(
                casng_date_abd_sty,
                'YYYY-MM-DD'
            ) as date_abd,
            notes_sty as notes,
            to_char(
                update_sty,
                'YYYY-MM-DD'
            ) as updated,
            to_char(
                creation_sty,
                'YYYY-MM-DD'
            ) as created

        FROM
            bdms.stratigraphy

        INNER JOIN bdms.borehole
            ON stratigraphy.id_bho_fk = id_bho

        INNER JOIN (
            SELECT
                id_bho_fk,
                array_agg(
                    json_build_object(
                        'workflow', id_wkf,
                        'role', name_rol,
                        'username', username,
                        'started', started,
                        'finished', finished
                    )
                ) as status
            FROM (
                SELECT
                    id_bho_fk,
                    name_rol,
                    id_wkf,
                    username,
                    started_wkf as started,
                    finished_wkf as finished
                FROM
                    bdms.workflow,
                    bdms.roles,
                    bdms.users
                WHERE
                    id_rol = id_rol_fk
                AND
                    id_usr = id_usr_fk
                ORDER BY
                    id_bho_fk asc, id_wkf asc
            ) t
            GROUP BY
                id_bho_fk
        ) as v
        ON
            v.id_bho_fk = id_bho
    """


class GetInstrumentsProfile(Action):

    sql = GetProfile.sql


class GetFillingProfile(Action):

    sql = """
        SELECT
            (
                select row_to_json(t)
                FROM (
                    SELECT
                        id_bho as id
                ) t
            ) as borehole,
            id_sty as id,
            stratigraphy.kind_id_cli as kind,
            COALESCE(name_sty, '') as fill_name,
            notes_sty as notes,
            primary_sty as primary,
            fill_casng_id_sty_fk as fill_casing,
            to_char(
                update_sty,
                'YYYY-MM-DD'
            ) as updated,
            to_char(
                creation_sty,
                'YYYY-MM-DD'
            ) as created

        FROM
            bdms.stratigraphy

        INNER JOIN bdms.borehole
            ON stratigraphy.id_bho_fk = id_bho

        INNER JOIN (
            SELECT
                id_bho_fk,
                array_agg(
                    json_build_object(
                        'workflow', id_wkf,
                        'role', name_rol,
                        'username', username,
                        'started', started,
                        'finished', finished
                    )
                ) as status
            FROM (
                SELECT
                    id_bho_fk,
                    name_rol,
                    id_wkf,
                    username,
                    started_wkf as started,
                    finished_wkf as finished
                FROM
                    bdms.workflow,
                    bdms.roles,
                    bdms.users
                WHERE
                    id_rol = id_rol_fk
                AND
                    id_usr = id_usr_fk
                ORDER BY
                    id_bho_fk asc, id_wkf asc
            ) t
            GROUP BY
                id_bho_fk
        ) as v
        ON
            v.id_bho_fk = id_bho
    """
