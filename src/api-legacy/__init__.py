# -*- coding: utf-8 -*-

VIEW = 0
EDIT = 1
CONTROL = 2
VALID = 3
PUBLIC = 4

from bms.v1.basehandler import BaseHandler
from bms.v1.exceptions import BmsException
from bms.v1.exceptions import BmsDatabaseException
from bms.v1.exceptions import DatabaseVersionMissmatch
from bms.v1.exceptions import AuthenticationException
from bms.v1.exceptions import AuthorizationException
from bms.v1.exceptions import WorkgroupFreezed
from bms.v1.exceptions import Locked
from bms.v1.exceptions import NotFound
from bms.v1.exceptions import MissingParameter
from bms.v1.exceptions import DuplicateException

# Borehole's Internationalization Handlers
from bms.v1.locales.handler import LocalesHandler

# Borehole's ACTION Handlers
from bms.v1.borehole.producer import BoreholeProducerHandler
from bms.v1.borehole.viewer import BoreholeViewerHandler
from bms.v1.borehole.filehandler import FileHandler

# Identifiers's ACTION Handlers
from bms.v1.borehole.identifier import CreateIdentifier
from bms.v1.borehole.identifier import CreateIdentifier
from bms.v1.borehole.identifier import DeleteIdentifier
from bms.v1.borehole.identifier import PatchIdentifier 
from bms.v1.borehole.identifier import ListIdentifiers 
from bms.v1.borehole.identifier import IdentifierProducerHandler
from bms.v1.borehole.identifier import IdentifierAdminHandler
from bms.v1.borehole.identifier import IdentifierViewerHandler

# Stratigraphy's ACTION Handlers
from bms.v1.borehole.stratigraphy.viewer import StratigraphyViewerHandler
from bms.v1.borehole.stratigraphy.producer import StratigraphyProducerHandler

# Profiles's ACTION Handlers
from bms.v1.borehole.profile.viewer import ProfileViewerHandler
from bms.v1.borehole.profile.producer import ProfileProducerHandler

# Profiles layers's ACTION Handlers
from bms.v1.borehole.profile.layer.viewer import ProfileLayerViewerHandler
from bms.v1.borehole.profile.layer.producer import ProfileLayerProducerHandler

# ACTION Handlers exports
from bms.v1.borehole.export.exporter import ExportHandler
from bms.v1.borehole.export.admin import ExportAdminHandler, ImportAdminHandler

# Stratigraphy's layers handlers
from bms.v1.borehole.stratigraphy.layer.producer import LayerProducerHandler
from bms.v1.borehole.stratigraphy.layer.viewer import LayerViewerHandler

from bms.v1.setting.handler import SettingHandler
from bms.v1.setting.download import DownloadHandler

from bms.v1.borehole.project.handler import ProjectHandler
from bms.v1.borehole.codelist.handler import CodeListHandler
from bms.v1.geoapi.handler import GeoapiHandler
from bms.v1.geoapi.municipality.handler import MunicipalityHandler
from bms.v1.geoapi.canton.handler import CantonHandler

# Workflows handlers
from bms.v1.workflow.producer import WorkflowProducerHandler

# Content handlers
from bms.v1.content.handler import ContentHandler
from bms.v1.content.admin import ContentAdminHandler

# Terms handlers
from bms.v1.terms.handler import TermsHandler
from bms.v1.terms.admin import TermsAdminHandler

# Feedback handlers
from bms.v1.feedback.handler import FeedbackHandler

# Actions
from bms.v1.borehole import CreateBorehole
from bms.v1.borehole import ListBorehole
from bms.v1.borehole import BoreholeIds
from bms.v1.borehole import GetBorehole
from bms.v1.borehole import CheckBorehole
from bms.v1.borehole import PatchBorehole

# GeoApi actions
from bms.v1.geoapi import ListMunicipality
from bms.v1.geoapi import ListCanton
from bms.v1.geoapi import Wmts
from bms.v1.geoapi import Wms
# from bms.v1.geoapi import GetFeature

# User actions
from bms.v1.user.handler import UserHandler
from bms.v1.user.admin import AdminHandler
from bms.v1.user import CheckUsername
from bms.v1.user import CreateUser

# Workgroup actions
from bms.v1.user.workgrpup.admin import WorkgroupAdminHandler
from bms.v1.user.workgrpup import ListWorkgroups
from bms.v1.user.workgrpup import CreateWorkgroup
