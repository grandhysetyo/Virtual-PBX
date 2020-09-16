/** Storage
 */
export const STORAGE_KEY_ALL_PBXS = "all_pbxs";
export const STORAGE_KEY_LOCATIONS = "locations";
export const STORAGE_KEY_ALL_PBX_REQUESTS = "all_pbx_requests";
export const STORAGE_KEY_ALL_OUTBOUND_NUMBERS = "all_outbound_numbers";
export const STORAGE_KEY_ALL_VOUCHERS = "all_vouchers";
export const STORAGE_KEY_USER_TYPE = "user_type";
export const STORAGE_KEY_USER_TOKEN = "token";
export const STORAGE_KEY_USER_NAME = "username";
export const STORAGE_KEY_USER_SALDO = "saldo"

/** User
 */
export const USER_TYPE_ADMIN = "admin";
export const USER_TYPE_NONADMIN = "nonadmin";

/** URL
 */
export const URL_BASE = "https://virtualpbx-api.telkomku.com/";
export const URL_SIGN_IN_WITH_GOOGLE = "authentication/sign_in_with_google";
export const URL_GET_LOCATIONS = "miscellaneous/get_locations";
export const URL_GET_CALL_LOG_DATA = "miscellaneous/get_call_log";
export const URL_CREATE_PBX_REQUEST = "pbx_request/create_pbx_request";
export const URL_GET_ALL_PBX_REQUESTS = "pbx_request/get_all_pbx_requests";
export const URL_DELETE_PBX_REQUEST = "pbx_request/delete_pbx_request";
export const URL_APPROVE_PBX_REQUEST = "pbx_request/approve_pbx_request";
export const URL_GET_ALL_PBXS = "pbx/get_all_pbxs";
export const URL_DELETE_PBX = "pbx/delete_pbx";
export const URL_GET_ALL_EXTENSIONS = "extension/get_all_extensions";
export const URL_CREATE_EXTENSION = "extension/create_extension";
export const URL_UPDATE_EXTENSION = "extension/update_extension";
export const URL_DELETE_EXTENSION = "extension/delete_extension";
export const URL_GET_OUTGOING_STATUS = "pbx/get_outgoing_status";
export const URL_GET_INCOMING_STATUS = "pbx/get_incoming_status";
export const URL_UPDATE_OUTGOING = "extension/update_outgoing";
export const URL_UPDATE_INCOMING = "extension/update_incoming";
export const URL_UPDATE_OPERATOR = "extension/update_operator";
export const URL_GET_ALL_OUTBOUND_NUMBERS = "outbound_number/get_all_outbound_number";
export const URL_CREATE_OUTBOUND_NUMBER = "outbound_number/create_outbound_number";
export const URL_UPDATE_OUTBOUND_NUMBER = "outbound_number/update_outbound_number";
export const URL_DELETE_OUTBOUND_NUMBER = "outbound_number/delete_outbound_number";
export const URL_GET_ALL_VOUCHERS = "voucher/get_all_voucher";
export const URL_BUY_VOUCHER = "voucher/buy_voucher";
export const URL_APPROVE_VOUCHER = "voucher/approve_voucher";
export const URL_REJECT_VOUCHER = "voucher/reject_voucher";
export const URL_PAYMENT_PROOF = "voucher/upload_payment_proof";
export const URL_GET_PAYMENT_PROOF = "voucher/get_payment_proof";
export const URL_REEDEM_VOUCHER = "voucher/reedem_voucher";
export const URL_GET_SALDO = "pbx_bill/get_saldo";
export const URL_TOP_UP_SALDO_EXTENSION = "pbx_bill/top_up_saldo_extension";
export const URL_TOP_UP_SALDO_PBX = "pbx_bill/top_up_saldo_pbx";
export const URL_TOP_UP_WALLET = "wallet/top_up_wallet";
export const URL_GET_TOP_UP_HISTORY = "wallet/get_top_up_history";