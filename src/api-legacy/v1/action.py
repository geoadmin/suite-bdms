# -*- coding: utf-8 -*-
import asyncio
import json
from bms import (
    PUBLIC,
    EDIT
)


class Action():

    lock_timeout = 10

    def __init__(self, conn=None, pool=None):
        self.conn = conn
        self.pool = pool
        self.idx = 0

    def decode(self, text, nullValue=None):
        if text is None:
            return nullValue
        return json.loads(text)

    def encode(self, value):
        return json.dumps(value)

    def run_until_complete(self, tasks):
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(
            asyncio.wait(
                [loop.create_task(x) for x in tasks]
            )
        )
        # loop.close()

    async def execute(self, *arg, **args):
        pass

    async def notify(self, user, topic, payload={}):
        evs = await self.conn.fetchval(
            """
                INSERT INTO bdms.events(
                    id_usr_fk,
                    topic_evs,
                    payload_evs
                )
                VALUES (
                    $1, $2, $3
                ) RETURNING id_evs
            """,
            user['id'], topic, self.encode(payload)
        )
        await self.conn.execute(f'''
            NOTIFY "{topic}", '{evs}'
        ''')

    def getIdx(self):
        self.idx += 1
        return "$%s" % self.idx

    def getordering(self, orderby, direction):
        _orderby = 'original_name_bho'
        if orderby == 'original_name':
            _orderby = 'original_name_bho'

        elif orderby == 'restriction':
            _orderby = 'restriction_id_cli'

        elif orderby == 'elevation_z':
            _orderby = 'elevation_z_bho'

        elif orderby == 'length':
            _orderby = 'total_depth'

        elif orderby == 'kind':
            _orderby = 'kind_id_cli'

        elif orderby == 'restriction_until':
            _orderby = 'restriction_until_bho'

        elif orderby == 'drilling_date':
            _orderby = 'drilling_date_bho'

        elif orderby == 'spud_date':
            _orderby = 'spud_date_bho'

        elif orderby == 'status':
            _orderby = 'status_id_cli'

        elif orderby == 'completness':
            _orderby = 'percentage'

        elif orderby == 'creator':
            _orderby = 'created_by_bho'

        elif orderby == 'creation':
            _orderby = 'created_bho'

        elif orderby == 'workgroup':
            _orderby = 'id_wgp_fk'

        elif orderby == 'purpose':
            _orderby = 'purpose_id_cli'

        elif orderby == 'elevation_z':
            _orderby = 'elevation_z_bho' 

        # there are inconsitencies in the client code, that sometimes the translation key is send to the api. Therefore some duplicate keys are mapped here.
        elif orderby == 'drilling_date':
            _orderby = 'drilling_date_bho'

        elif orderby == 'boreholestatus':
            _orderby = 'status_id_cli'

        elif orderby == 'createdBy':
            _orderby = 'created_by_bho'

        elif orderby == 'drilling_end_date':
            _orderby = 'drilling_date_bho'

        elif orderby == 'creationdate':
            _orderby = 'created_bho'
        
        elif orderby == 'totaldepth':
            _orderby = 'total_depth'
        
        elif orderby == 'top_bedrock':
            _orderby = 'top_bedrock_bho'
        
        else:
            orderby = 'original_name'

        if direction not in ['DESC', 'ASC']:
            direction = 'ASC'

        return _orderby, direction

    def filterPermission(self, user, exclude=[]):

        where = []

        roles = user['roles'].copy()
        if len(exclude) > 0:
            for role in exclude:
                if role in roles:
                    roles.pop(
                        roles.index(role)
                    )

        # If user is a viewer then he/she can see all published boreholes
        if user['viewer'] is True:
            where.append(f"""
                borehole.public_bho IS TRUE
            """)

        # If the user belongs to a workgroups then he can see all
        # the belonging boreholes with his role active
        if user['workgroups'] not in ['', None]:
            for workgroup in user['workgroups']:

                # User can see not finished data belonging to his workgroups
                where.append(f"""
                    id_wgp_fk = {workgroup['id']}
                """)

        return '({})'.format(
            ' OR '.join(where)
        )

    def filterBackfill(self, filter={}):
        params = []
        where = []
        joins = []

        layer_codelist = []

        keys = filter.keys()

        if 'fill_name' in keys and filter['fill_name'] not in ['', None]:
            params.append(f"%{filter['fill_name']}%")
            where.append("""
                name_sty ILIKE %s
            """ % self.getIdx())

        if 'fill_material' in keys and filter['fill_material'] not in ['', None]:
            params.append(filter['fill_material'])
            where.append("""
                fill_material_id_cli = %s
            """ % self.getIdx())

        if 'fill_kind' in keys and filter['fill_kind'] not in ['', None]:
            params.append(filter['fill_kind'])
            where.append("""
                fill_kind_id_cli = %s
            """ % self.getIdx())

        if 'backfill_notes' in keys and filter['backfill_notes'] not in ['', None]:
            params.append(f"%{filter['backfill_notes']}%")
            where.append("""
                stratigraphy.notes_sty ILIKE %s
            """ % self.getIdx())

        if 'backfill_depth_from_from' in keys and filter['backfill_depth_from_from'] not in ['', None]:
            params.append(float(filter['backfill_depth_from_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'backfill_depth_from_to' in keys and filter['backfill_depth_from_to'] not in ['', None]:
            params.append(float(filter['backfill_depth_from_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'backfill_depth_to_from' in keys and filter['backfill_depth_to_from'] not in ['', None]:
            params.append(float(filter['backfill_depth_to_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'backfill_depth_to_to' in keys and filter['backfill_depth_to_to'] not in ['', None]:
            params.append(float(filter['backfill_depth_to_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'backfill_layer_notes' in keys and filter['backfill_layer_notes'] not in ['', None]:
            params.append(f"%{filter['backfill_layer_notes']}%")
            where.append("""
                notes_lay ILIKE %s
            """ % self.getIdx())

        return where, params, joins

    def filterInstrument(self, filter={}):
        params = []
        where = []
        joins = []

        layer_codelist = []

        keys = filter.keys()

        if 'instrument_depth_from_from' in keys and filter['instrument_depth_from_from'] not in ['', None]:
            params.append(float(filter['instrument_depth_from_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'instrument_depth_from_to' in keys and filter['instrument_depth_from_to'] not in ['', None]:
            params.append(float(filter['instrument_depth_from_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'instrument_depth_to_from' in keys and filter['instrument_depth_to_from'] not in ['', None]:
            params.append(float(filter['instrument_depth_to_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'instrument_depth_to_to' in keys and filter['instrument_depth_to_to'] not in ['', None]:
            params.append(float(filter['instrument_depth_to_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'instrument_notes' in keys and filter['instrument_notes'] not in ['', None]:
            params.append(f"%{filter['instrument_notes']}%")
            where.append("""
                notes_lay ILIKE %s
            """ % self.getIdx())

        if 'instrument_id' in keys and filter['instrument_id'] not in ['', None]:
            params.append(f"%{filter['instrument_id']}%")
            where.append("""
                instr_id ILIKE %s
            """ % self.getIdx())

        if 'instrument_kind' in keys and filter['instrument_kind'] not in ['', None]:
            params.append(filter['instrument_kind'])
            where.append("""
                instr_kind_id_cli = %s
            """ % self.getIdx())

        if 'instrument_status' in keys and filter['instrument_status'] not in ['', None]:
            params.append(filter['instrument_status'])
            where.append("""
                instr_status_id_cli = %s
            """ % self.getIdx())

        if 'instrument_layer_notes' in keys and filter['instrument_layer_notes'] not in ['', None]:
            params.append(f"%{filter['instrument_layer_notes']}%")
            where.append("""
                notes_lay ILIKE %s
            """ % self.getIdx())

        return where, params, joins

    def filterCasings(self, filter={}):
        params = []
        where = []
        joins = []

        layer_codelist = []

        keys = filter.keys()

        if 'casing_name' in keys and filter['casing_name'] not in ['', None]:
            params.append(f"%{filter['casing_name']}%")
            where.append("""
                stratigraphy.name_sty ILIKE %s
            """ % self.getIdx())

        if 'date_abd_from' in keys and filter['date_abd_from'] not in ['', None]:
            params.append(filter['date_abd_from'])
            where.append("""
                casng_date_abd_sty >= to_date(%s, 'YYYY-MM-DD')
            """ % self.getIdx())

        if 'date_abd_to' in keys and filter['date_abd_to'] not in ['', None]:
            params.append(filter['date_abd_to'])
            where.append("""
                casng_date_abd_sty <= to_date(%s, 'YYYY-MM-DD')
            """ % self.getIdx())

        if 'casing_notes' in keys and filter['casing_notes'] not in ['', None]:
            params.append(f"%{filter['casing_notes']}%")
            where.append("""
                stratigraphy.notes_sty ILIKE %s
            """ % self.getIdx())

        if 'casing_id' in keys and filter['casing_id'] not in ['', None]:
            params.append(f"%{filter['casing_id']}%")
            where.append("""
                layer.casng_id ILIKE %s
            """ % self.getIdx())

        if 'casing_depth_from_from' in keys and filter['casing_depth_from_from'] not in ['', None]:
            params.append(float(filter['casing_depth_from_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'casing_depth_from_to' in keys and filter['casing_depth_from_to'] not in ['', None]:
            params.append(float(filter['casing_depth_from_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'casing_depth_to_from' in keys and filter['casing_depth_to_from'] not in ['', None]:
            params.append(float(filter['casing_depth_to_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'casing_depth_to_to' in keys and filter['casing_depth_to_to'] not in ['', None]:
            params.append(float(filter['casing_depth_to_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'casing_kind' in keys and filter['casing_kind'] not in ['', None]:
            params.append(filter['casing_kind'])
            where.append("""
                casng_kind_id_cli = %s
            """ % self.getIdx())

        if 'casing_material' in keys and filter['casing_material'] not in ['', None]:
            params.append(filter['casing_material'])
            where.append("""
                casng_material_id_cli = %s
            """ % self.getIdx())

        if 'casing_date_spud_from' in keys and filter['casing_date_spud_from'] not in ['', None]:
            params.append(filter['casing_date_spud_from'])
            where.append("""
                casng_date_spud_lay >= to_date(%s, 'YYYY-MM-DD')
            """ % self.getIdx())

        if 'casing_date_spud_to' in keys and filter['casing_date_spud_to'] not in ['', None]:
            params.append(filter['casing_date_spud_to'])
            where.append("""
                casng_date_spud_lay <= to_date(%s, 'YYYY-MM-DD')
            """ % self.getIdx())

        if 'casing_date_finish_from' in keys and filter['casing_date_finish_from'] not in ['', None]:
            params.append(filter['casing_date_finish_from'])
            where.append("""
                casng_date_finish_lay >= to_date(%s, 'YYYY-MM-DD')
            """ % self.getIdx())

        if 'casing_date_finish_to' in keys and filter['casing_date_finish_to'] not in ['', None]:
            params.append(filter['casing_date_finish_to'])
            where.append("""
                casng_date_finish_lay <= to_date(%s, 'YYYY-MM-DD')
            """ % self.getIdx())

        if 'casing_inner_diameter_from' in keys and filter['casing_inner_diameter_from'] not in ['', None]:
            params.append(float(filter['casing_inner_diameter_from']))
            where.append("""
                casng_inner_diameter_lay >= %s
            """ % self.getIdx())

        if 'casing_inner_diameter_to' in keys and filter['casing_inner_diameter_to'] not in ['', None]:
            params.append(float(filter['casing_inner_diameter_to']))
            where.append("""
                casng_inner_diameter_lay <= %s
            """ % self.getIdx())

        if 'casing_outer_diameter_from' in keys and filter['casing_outer_diameter_from'] not in ['', None]:
            params.append(float(filter['casing_outer_diameter_from']))
            where.append("""
                casng_outer_diameter_lay >= %s
            """ % self.getIdx())

        if 'casing_outer_diameter_to' in keys and filter['casing_outer_diameter_to'] not in ['', None]:
            params.append(float(filter['casing_outer_diameter_to']))
            where.append("""
                casng_outer_diameter_lay <= %s
            """ % self.getIdx())

        if 'casing_layer_notes' in keys and filter['casing_layer_notes'] not in ['', None]:
            params.append(f"%{filter['casing_layer_notes']}%")
            where.append("""
                notes_lay ILIKE %s
            """ % self.getIdx())

        return where, params, joins

    def filterProfileLayers(self, filter={}):

        params = []
        where = []
        joins = []

        layer_codelist = []

        keys = filter.keys()

        if 'layer_grain_shape' in keys and filter['layer_grain_shape'] not in ['', None]:
            params.append(filter['layer_grain_shape'])
            layer_codelist.append("""
                id_cli_fk = %s
            """ % self.getIdx())

        if 'layer_grain_granularity' in keys and filter['layer_grain_granularity'] not in ['', None]:
            params.append(filter['layer_grain_granularity'])
            layer_codelist.append("""
                id_cli_fk = %s
            """ % self.getIdx())

        if 'layer_organic_component' in keys and filter['layer_organic_component'] not in ['', None]:
            params.append(filter['layer_organic_component'])
            layer_codelist.append("""
                id_cli_fk = %s
            """ % self.getIdx())

        if 'layer_debris' in keys and filter['layer_debris'] not in ['', None]:
            params.append(filter['layer_debris'])
            layer_codelist.append("""
                id_cli_fk = %s
            """ % self.getIdx())

        if 'layer_color' in keys and filter['layer_color'] not in ['', None]:
            params.append(filter['layer_color'])
            layer_codelist.append("""
                id_cli_fk = %s
            """ % self.getIdx())
        
        if 'layer_uscs_3' in keys and filter['layer_uscs_3'] not in ['', None]:
            params.append(filter['layer_uscs_3'])
            layer_codelist.append("""
                id_cli_fk = %s
            """ % self.getIdx())

        if len(layer_codelist) > 0:
            joins.append("""
                INNER JOIN (
                    SELECT DISTINCT
                        id_lay_fk
                    FROM
                        bdms.layer_codelist
                    WHERE
                        {}
                ) clr
                ON clr.id_lay_fk = id_lay
            """.format(
                ' OR '.join(layer_codelist)
            ))

        if 'layer_lithology_top_bedrock' in keys and filter['layer_lithology_top_bedrock'] not in ['', None]:
            params.append(filter['layer_lithology_top_bedrock'])
            where.append("""
                layer.lithology_top_bedrock_id_cli = %s
            """ % self.getIdx())

        if 'layer_uscs_1' in keys and filter['layer_uscs_1'] not in ['', None]:
            params.append(filter['layer_uscs_1'])
            where.append("""
                uscs_1_id_cli = %s
            """ % self.getIdx())

        if 'layer_uscs_2' in keys and filter['layer_uscs_2'] not in ['', None]:
            params.append(filter['layer_uscs_2'])
            where.append("""
                uscs_2_id_cli = %s
            """ % self.getIdx())

        if 'layer_uscs_determination' in keys and filter['layer_uscs_determination'] not in ['', None]:
            params.append(filter['layer_uscs_determination'])
            where.append("""
                uscs_determination_id_cli = %s
            """ % self.getIdx())

        if 'layer_uscs_original' in keys and filter['layer_uscs_original'] not in ['', None]:
            params.append(f"%{filter['layer_uscs_original']}%")
            where.append("""
                uscs_original_lay ILIKE %s
            """ % self.getIdx())

        if 'layer_borehole' in keys and filter['layer_borehole'] not in ['', None]:
            params.append(filter['layer_borehole'])
            where.append("""
                stratigraphy.id_bho_fk = %s
            """ % self.getIdx())

        if 'layer_kind' in keys and filter['layer_kind'] not in ['', None]:
            params.append(filter['layer_kind'])
            where.append("""
                stratigraphy.kind_id_cli = %s
            """ % self.getIdx())

        if 'layer_depth_from' in keys and filter['layer_depth_from'] not in ['', None]:
            params.append(float(filter['layer_depth_from']))
            where.append("""
                depth_to_lay > %s
            """ % self.getIdx())

        if 'layer_depth_to' in keys and filter['layer_depth_to'] not in ['', None]:
            params.append(float(filter['layer_depth_to']))
            where.append("""
                depth_from_lay < %s
            """ % self.getIdx())

        if 'layer_depth_from_from' in keys and filter['layer_depth_from_from'] not in ['', None]:
            params.append(float(filter['layer_depth_from_from']))
            where.append("""
                depth_from_lay >= %s
            """ % self.getIdx())

        if 'layer_depth_from_to' in keys and filter['layer_depth_from_to'] not in ['', None]:
            params.append(float(filter['layer_depth_from_to']))
            where.append("""
                depth_from_lay <= %s
            """ % self.getIdx())

        if 'layer_depth_to_from' in keys and filter['layer_depth_to_from'] not in ['', None]:
            params.append(float(filter['layer_depth_to_from']))
            where.append("""
                depth_to_lay >= %s
            """ % self.getIdx())

        if 'layer_depth_to_to' in keys and filter['layer_depth_to_to'] not in ['', None]:
            params.append(float(filter['layer_depth_to_to']))
            where.append("""
                depth_to_lay <= %s
            """ % self.getIdx())

        if 'layer_lithological_description' in keys and filter['layer_description'] not in ['', None]:
            params.append(f"%{filter['layer_description']}%")
            where.append("""
                lithological_description_lay ILIKE %s
            """ % self.getIdx())

        if 'layer_facies_description' in keys and filter['layer_geology'] not in ['', None]:
            params.append(f"%{filter['layer_geology']}%")
            where.append("""
                facies_description_lay ILIKE %s
            """ % self.getIdx())

        if 'layer_lithology' in keys and filter['layer_lithology'] not in ['', None]:
            params.append(filter['layer_lithology'])
            where.append("""
                lithology_id_cli = %s
            """ % self.getIdx())

        if 'layer_lithostratigraphy' in keys and filter['layer_lithostratigraphy'] not in ['', None]:
            params.append(filter['layer_lithostratigraphy'])
            where.append("""
                lithostratigraphy_id_cli = %s
            """ % self.getIdx())

        if 'layer_chronostratigraphy' in keys and filter['layer_chronostratigraphy'] not in ['', None]:
            params.append(filter['layer_chronostratigraphy'])
            where.append("""
                chronostratigraphy_id_cli = %s
            """ % self.getIdx())

        if 'layer_plasticity' in keys and filter['layer_plasticity'] not in ['', None]:
            params.append(filter['layer_plasticity'])
            where.append("""
                plasticity_id_cli = %s
            """ % self.getIdx())

        if 'layer_humidity' in keys and filter['layer_humidity'] not in ['', None]:
            params.append(filter['layer_humidity'])
            where.append("""
                humidity_id_cli = %s
            """ % self.getIdx())

        if 'layer_consistance' in keys and filter['layer_consistance'] not in ['', None]:
            params.append(filter['layer_consistance'])
            where.append("""
                consistance_id_cli = %s
            """ % self.getIdx())

        if 'layer_gradation' in keys and filter['layer_gradation'] not in ['', None]:
            params.append(filter['layer_gradation'])
            where.append("""
                gradation_id_cli = %s
            """ % self.getIdx())

        if 'layer_alteration' in keys and filter['layer_alteration'] not in ['', None]:
            params.append(filter['layer_alteration'])
            where.append("""
                alteration_id_cli = %s
            """ % self.getIdx())

        if 'layer_compactness' in keys and filter['layer_compactness'] not in ['', None]:
            params.append(filter['layer_compactness'])
            where.append("""
                compactness_id_cli = %s
            """ % self.getIdx())

        if 'layer_striae' in keys and filter['layer_striae'] != -1:
            if filter['layer_striae'] == None:
                where.append("""
                    striae_lay IS NULL
                """)
            else:
                params.append(filter['layer_striae'])
                where.append("""
                    striae_lay = %s
                """ % self.getIdx())

        if 'layer_grain_size_1' in keys and filter['layer_grain_size_1'] not in ['', None]:
            params.append(filter['layer_grain_size_1'])
            where.append("""
                grain_size_1_id_cli = %s
            """ % self.getIdx())

        if 'layer_grain_size_2' in keys and filter['layer_grain_size_2'] not in ['', None]:
            params.append(filter['layer_grain_size_2'])
            where.append("""
                grain_size_2_id_cli = %s
            """ % self.getIdx())

        if 'layer_cohesion' in keys and filter['layer_cohesion'] not in ['', None]:
            params.append(filter['layer_cohesion'])
            where.append("""
                cohesion_id_cli = %s
            """ % self.getIdx())

        if 'layer_qt_description' in keys and filter['layer_qt_description'] not in ['', None]:
            params.append(filter['layer_qt_description'])
            where.append("""
                qt_description_id_cli = %s
            """ % self.getIdx())

        return where, params, joins

    def filterBorehole(self, filter={}):
        params = []
        where = []

        keys = filter.keys()

        if 'id' in keys and filter['id'] not in ['', None]:
            _or = []
            for bid in filter['id'].split(','):
                params.append(int(bid))
                _or.append("""
                    borehole.id_bho = %s
                """ % self.getIdx())
            where.append("(%s)" % " OR ".join(_or))

        else:
            if (
                'role' in keys and
                filter['role'] not in ['', None] and
                filter['role'] != 'all'
            ):
                params.append(filter['role'])
                where.append("""
                    status[
                        array_length(status, 1)
                    ]  ->> 'role' = %s
                """ % self.getIdx())

            if (
                'workgroup' in keys and
                filter['workgroup'] not in ['', None]
                and filter['workgroup'] != 'all'
            ):
                params.append(filter['workgroup'])
                where.append("""
                    id_wgp_fk = %s
                """ % self.getIdx())

            if 'borehole_identifier' in keys and filter['borehole_identifier'] != None:
                params.append(int(filter['borehole_identifier']))
                where.append("""
                    borehole.id_bho IN (SELECT id_bho_fk FROM bdms.borehole_codelist WHERE id_cli_fk = %s)
                """ % self.getIdx())

            if 'identifier_value' in keys and filter['identifier_value'] not in ['', None]:
                params.append("%%%s%%" % filter['identifier_value'])
                where.append("""
                    borehole.id_bho IN (SELECT id_bho_fk FROM bdms.borehole_codelist WHERE value_bco ILIKE %s)
                """ % self.getIdx())

            if 'identifier' in keys and filter['identifier'] not in ['', None]:
                if filter['identifier'] == '$null':
                    where.append("""
                        original_name_bho IS NULL
                    """)
                else:
                    params.append("%%%s%%" % filter['identifier'])
                    where.append("""
                        original_name_bho ILIKE %s
                    """ % self.getIdx())

            if 'original_name' in keys and filter['original_name'] not in ['', None]:
                if filter['original_name'] == '$null':
                    where.append("""
                        original_name_bho IS NULL
                    """)
                else:
                    params.append("%%%s%%" % filter['original_name'])
                    where.append("""
                        original_name_bho ILIKE %s
                    """ % self.getIdx())

            if 'alternate_name' in keys and filter['alternate_name'] not in ['', None]:
                if filter['alternate_name'] == '$null':
                    where.append("""
                        alternate_name_bho IS NULL
                    """)
                else:
                    params.append("%%%s%%" % filter['alternate_name'])
                    where.append("""
                        alternate_name_bho ILIKE %s
                    """ % self.getIdx())

            if 'project_name' in keys and filter['project_name'] not in ['', None]:
                if filter['project_name'] == '$null':
                    where.append("""
                        project_name_bho IS NULL
                    """)
                else:
                    params.append("%%%s%%" % filter['project_name'])
                    where.append("""
                        project_name_bho ILIKE %s
                    """ % self.getIdx())

            if 'kind' in keys and filter['kind'] not in ['', None]:
                params.append(int(filter['kind']))
                where.append("""
                    kind_id_cli = %s
                """ % self.getIdx())

            if 'cuttings' in keys and filter['cuttings'] not in ['', None]:
                params.append(int(filter['cuttings']))
                where.append("""
                    cuttings_id_cli = %s
                """ % self.getIdx())

            if 'restriction' in keys and filter[
                    'restriction'] not in ['', None]:
                params.append(int(filter['restriction']))
                where.append("""
                    restriction_id_cli = %s
                """ % self.getIdx())

            if 'status' in keys and filter[
                    'status'] not in ['', None]:
                params.append(int(filter['status']))
                where.append("""
                    status_id_cli = %s
                """ % self.getIdx())

            if 'method' in keys and filter[
                    'method'] not in ['', None]:
                params.append(int(filter['method']))
                where.append("""
                    drilling_method_id_cli = %s
                """ % self.getIdx())

            if 'purpose' in keys and filter['purpose'] not in ['', None]:
                params.append(int(filter['purpose']))
                where.append("""
                    purpose_id_cli = %s
                """ % self.getIdx())

            if 'extent' in keys and filter['extent'] not in ['', None]:
                for coord in filter['extent']:
                    params.append(coord)
                where.append("""
                    ST_Intersects(
                        geom_bho,
                        ST_MakeEnvelope(
                            %s, %s, %s, %s, 2056
                        )
                    )
                """ % (
                    self.getIdx(),
                    self.getIdx(),
                    self.getIdx(),
                    self.getIdx()
                ))

            if 'canton' in keys and filter['canton'] not in ['', None]:
                params.append(int(filter['canton']))
                where.append("""
                    canton_bho = %s
                """ % self.getIdx())

            if 'municipality' in keys and filter['municipality'] not in ['', None]:
                params.append(int(filter['municipality']))
                where.append("""
                    city_bho = %s
                """ % self.getIdx())

            if 'groundwater' in keys and filter['groundwater'] != -1:
                if filter['groundwater'] == None:
                    where.append("""
                        groundwater_bho IS NULL
                    """)
                else:
                    params.append(filter['groundwater'])
                    where.append("""
                        groundwater_bho = %s
                    """ % self.getIdx())

            if 'creation' in keys and filter['creation'] not in ['', None]:
                params.append(filter['creation'])
                where.append("""
                    created_bho::date = to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'restriction_until_from' in keys and filter['restriction_until_from'] not in ['', None]:
                params.append(filter['restriction_until_from'])
                where.append("""
                    restriction_until_bho >= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'restriction_until_to' in keys and filter['restriction_until_to'] not in ['', None]:
                params.append(filter['restriction_until_to'])
                where.append("""
                    restriction_until_bho <= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'drilling_date_from' in keys and filter['drilling_date_from'] not in ['', None]:
                params.append(filter['drilling_date_from'])
                where.append("""
                    drilling_date_bho >= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'drilling_date_to' in keys and filter['drilling_date_to'] not in ['', None]:
                params.append(filter['drilling_date_to'])
                where.append("""
                    drilling_date_bho <= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'spud_date_from' in keys and filter['spud_date_from'] not in ['', None]:
                params.append(filter['spud_date_from'])
                where.append("""
                    spud_date_bho >= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'spud_date_to' in keys and filter['spud_date_to'] not in ['', None]:
                params.append(filter['spud_date_to'])
                where.append("""
                    spud_date_bho <= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'drill_diameter_from' in keys and filter['drill_diameter_from'] not in ['', None]:
                params.append(float(filter['drill_diameter_from']))
                where.append("""
                    drilling_diameter_bho >= %s
                """ % self.getIdx())

            if 'drill_diameter_to' in keys and filter['drill_diameter_to'] not in ['', None]:
                params.append(float(filter['drill_diameter_to']))
                where.append("""
                    drilling_diameter_bho <= %s
                """ % self.getIdx())

            if 'qt_location' in keys and filter[
                    'qt_location'] not in ['', None]:
                params.append(int(filter['qt_location']))
                where.append("""
                    qt_location_id_cli = %s
                """ % self.getIdx())

            if 'reference_elevation_from' in keys and filter['reference_elevation_from'] not in ['', None]:
                params.append(float(filter['reference_elevation_from']))
                where.append("""
                    reference_elevation_bho >= %s
                """ % self.getIdx())

            if 'reference_elevation_to' in keys and filter['reference_elevation_to'] not in ['', None]:
                params.append(float(filter['reference_elevation_to']))
                where.append("""
                    reference_elevation_bho <= %s
                """ % self.getIdx())

            if 'reference_elevation_type' in keys and filter[
                    'reference_elevation_type'] not in ['', None]:
                params.append(int(filter['reference_elevation_type']))
                where.append("""
                    reference_elevation_type_id_cli = %s
                """ % self.getIdx())

            if 'qt_reference_elevation' in keys and filter[
                    'qt_reference_elevation'] not in ['', None]:
                params.append(int(filter['qt_reference_elevation']))
                where.append("""
                    qt_reference_elevation_id_cli = %s
                """ % self.getIdx())

            if 'elevation_z_from' in keys and filter['elevation_z_from'] not in ['', None]:
                params.append(float(filter['elevation_z_from']))
                where.append("""
                    elevation_z_bho >= %s
                """ % self.getIdx())

            if 'elevation_z_to' in keys and filter['elevation_z_to'] not in ['', None]:
                params.append(float(filter['elevation_z_to']))
                where.append("""
                    elevation_z_bho <= %s
                """ % self.getIdx())

            if 'qt_elevation' in keys and filter[
                    'qt_elevation'] not in ['', None]:
                params.append(int(filter['qt_elevation']))
                where.append("""
                    qt_elevation_id_cli = %s
                """ % self.getIdx())

            if 'bore_inc_from' in keys and filter['bore_inc_from'] not in ['', None]:
                params.append(float(filter['bore_inc_from']))
                where.append("""
                    inclination_bho >= %s
                """ % self.getIdx())

            if 'bore_inc_to' in keys and filter['bore_inc_to'] not in ['', None]:
                params.append(float(filter['bore_inc_to']))
                where.append("""
                    inclination_bho <= %s
                """ % self.getIdx())

            if 'bore_inc_dir_from' in keys and filter['bore_inc_dir_from'] not in ['', None]:
                params.append(float(filter['bore_inc_dir_from']))
                where.append("""
                    inclination_direction_bho >= %s
                """ % self.getIdx())

            if 'bore_inc_dir_to' in keys and filter['bore_inc_dir_to'] not in ['', None]:
                params.append(float(filter['bore_inc_dir_to']))
                where.append("""
                    inclination_direction_bho <= %s
                """ % self.getIdx())

            if 'qt_inclination_direction' in keys and filter[
                    'qt_inclination_direction'] not in ['', None]:
                params.append(int(filter['qt_inclination_direction']))
                where.append("""
                    qt_inclination_direction_id_cli = %s
                """ % self.getIdx())

            if 'length_from' in keys and filter['length_from'] not in ['', None]:
                params.append(float(filter['length_from']))
                where.append("""
                    total_depth_bho >= %s
                """ % self.getIdx())

            if 'length_to' in keys and filter['length_to'] not in ['', None]:
                params.append(float(filter['length_to']))
                where.append("""
                    total_depth_bho <= %s
                """ % self.getIdx())

            if 'total_depth_tvd_from' in keys and filter['total_depth_tvd_from'] not in ['', None]:
                params.append(float(filter['total_depth_tvd_from']))
                where.append("""
                    total_depth_tvd_bho >= %s
                """ % self.getIdx())

            if 'total_depth_tvd_to' in keys and filter['total_depth_tvd_to'] not in ['', None]:
                params.append(float(filter['total_depth_tvd_to']))
                where.append("""
                    total_depth_tvd_bho <= %s
                """ % self.getIdx())

            if 'qt_total_depth_tvd' in keys and filter[
                    'qt_total_depth_tvd'] not in ['', None]:
                params.append(int(filter['qt_total_depth_tvd']))
                where.append("""
                    qt_total_depth_tvd_id_cli = %s
                """ % self.getIdx())

            if 'top_bedrock_from' in keys and filter['top_bedrock_from'] not in ['', None]:
                params.append(float(filter['top_bedrock_from']))
                where.append("""
                    top_bedrock_bho >= %s
                """ % self.getIdx())

            if 'top_bedrock_to' in keys and filter['top_bedrock_to'] not in ['', None]:
                params.append(float(filter['top_bedrock_to']))
                where.append("""
                    top_bedrock_bho <= %s
                """ % self.getIdx())

            if 'qt_top_bedrock' in keys and filter[
                    'qt_top_bedrock'] not in ['', None]:
                params.append(int(filter['qt_top_bedrock']))
                where.append("""
                    qt_top_bedrock_id_cli = %s
                """ % self.getIdx())

            if 'top_bedrock_tvd_from' in keys and filter['top_bedrock_tvd_from'] not in ['', None]:
                params.append(float(filter['top_bedrock_tvd_from']))
                where.append("""
                    top_bedrock_tvd_bho >= %s
                """ % self.getIdx())

            if 'top_bedrock_tvd_to' in keys and filter['top_bedrock_tvd_to'] not in ['', None]:
                params.append(float(filter['top_bedrock_tvd_to']))
                where.append("""
                    top_bedrock_tvd_bho <= %s
                """ % self.getIdx())

            if 'qt_top_bedrock_tvd' in keys and filter[
                    'qt_top_bedrock_tvd'] not in ['', None]:
                params.append(int(filter['qt_top_bedrock_tvd']))
                where.append("""
                    qt_top_bedrock_tvd_id_cli = %s
                """ % self.getIdx())

            if 'lithology_top_bedrock' in keys and filter[
                    'lithology_top_bedrock'] not in ['', None]:
                params.append(int(filter['lithology_top_bedrock']))
                where.append("""
                    lithology_top_bedrock_id_cli = %s
                """ % self.getIdx())

            if 'qt_depth' in keys and filter['qt_depth'] not in ['', None]:
                params.append(int(filter['qt_depth']))
                where.append("""
                    qt_depth_id_cli = %s
                """ % self.getIdx())

            if 'srs' in keys and filter['srs'] not in ['', None]:
                params.append(int(filter['srs']))
                where.append("""
                    srs_id_cli = %s
                """ % self.getIdx())

            if 'lithostratigraphy_top_bedrock' in keys and filter[
                    'lithostratigraphy_top_bedrock'] not in ['', None]:
                params.append(int(filter['lithostratigraphy_top_bedrock']))
                where.append("""
                    lithostrat_id_cli = %s
                """ % self.getIdx())

            if 'chronostratigraphy_top_bedrock' in keys and filter[
                    'chronostratigraphy_top_bedrock'] not in ['', None]:
                params.append(int(filter['chronostratigraphy_top_bedrock']))
                where.append("""
                    lithostrat_id_cli = %s
                """ % self.getIdx())

            if 'created_date_from' in keys and filter['created_date_from'] not in ['', None]:
                params.append(filter['created_date_from'])
                where.append("""
                    created_bho >= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'created_date_to' in keys and filter['created_date_to'] not in ['', None]:
                params.append(filter['created_date_to'])
                where.append("""
                    created_bho <= to_date(%s, 'YYYY-MM-DD')
                """ % self.getIdx())

            if 'created_by' in keys and filter['created_by'] not in ['', None]:
                params.append(filter['created_by'])
                where.append("""
                    creator.username ILIKE %s
                """ % self.getIdx())

        return where, params
