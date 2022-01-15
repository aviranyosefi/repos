/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/currentRecord', 'N/search'],
    function (currentRecord, search ) {
        function pageInit(scriptContext) {
            country = nlapiGetFieldValue('custpage_country');
            if (country != null && country != 'US' && country != 'JP' && country != 'MX' && country != 'GB' && country != 'AT' && country != 'CA' && country != 'CN' && country !='IN') {
                nlapiGetField('custpage_state_select').setDisplayType('hidden')       
            }
            else if (country != null){
                nlapiGetField('custpage_state').setDisplayType('hidden')             
            }
            if (country == 'US' || country == 'CA' || country == 'IN') {
                nlapiSetFieldMandatory('custpage_state_select', true)
            }
            else if (country != null) { 
                nlapiSetFieldMandatory('custpage_state_select', false)
            }
            custpage_sub = nlapiGetFieldValue('custpage_sub');
            if (custpage_sub != 22 && custpage_sub != 18  &&custpage_sub != null) {
                nlapiGetField('custpage_bank_details').setDisplayType('hidden')
            }
            if (custpage_sub == 18) {
                country_ligal = nlapiGetFieldValue('custpage_country_ligal');
                if (country_ligal != null && country_ligal != 'US' && country_ligal != 'JP' && country_ligal != 'MX' && country_ligal != 'GB' && country_ligal != 'AT' && country_ligal != 'CA' && country_ligal != 'CN' && country_ligal != 'IN') {
                    nlapiGetField('custpage_state_select_ligal').setDisplayType('hidden')
                }
                else if (country != null) {
                    nlapiGetField('custpage_state_ligal').setDisplayType('hidden')

                }
                payment_type_us = nlapiGetFieldValue('custpage_payment_type_us');
                if (payment_type_us == 72) {
                    nlapiGetField('custpage_bank_name_us').setDisplayType('hidden')
                    nlapiGetField('custpage_iban_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank1_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank2_us').setDisplayType('hidden')
                    nlapiGetField('custpage_swift_us').setDisplayType('hidden')
                    nlapiSetFieldMandatory('custpage_account_number_us', true)
                    nlapiSetFieldMandatory('custpage_bank_number_us', true)
                }
                else {
                    nlapiGetField('custpage_bank_number_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank_account_type_us').setDisplayType('hidden')
                }
                
            }
           
        }
        function fieldChanged(scriptContext) {
            debugger;
            var currentRecord = scriptContext.currentRecord;
            var name = scriptContext.fieldId;
            if (name == 'custpage_country') {
                country = nlapiGetFieldValue('custpage_country');
                if (country == 'US' || country == 'JP' || country == 'MX' || country == 'GB' || country == 'AT' || country == 'CA' || country == 'CN' || country == 'IN') {
                    //currentRecord.getField({ fieldId: 'custpage_state_select' }).isDisplay = false;
                    nlapiGetField('custpage_state_select').setDisplayType('normal')
                    nlapiGetField('custpage_state').setDisplayType('hidden')
                    addOptions(currentRecord, country, 'custpage_state_select');

                }
                else {
                    nlapiGetField('custpage_state_select').setDisplayType('hidden')
                    nlapiGetField('custpage_state').setDisplayType('normal')
                    nlapiSetFieldValue('custpage_state', '');
                }
            }
            else if (name == 'custpage_country_ligal') {
                country = nlapiGetFieldValue('custpage_country_ligal');
                if (country == 'US' || country == 'JP' || country == 'MX' || country == 'GB' || country == 'AT' || country == 'CA' || country == 'CN'|| country == 'IN') {
                    //currentRecord.getField({ fieldId: 'custpage_state_select' }).isDisplay = false;
                    nlapiGetField('custpage_state_select_ligal').setDisplayType('normal')
                    nlapiGetField('custpage_state_ligal').setDisplayType('hidden')
                    addOptions(currentRecord, country, 'custpage_state_select_ligal');

                }
                else {
                    nlapiGetField('custpage_state_select_ligal').setDisplayType('hidden')
                    nlapiGetField('custpage_state_ligal').setDisplayType('normal')
                    nlapiSetFieldValue('custpage_state_ligal', '');
                }
            }
            else if (name == 'custpage_payment_type_us') {
                payment_type_us = nlapiGetFieldValue('custpage_payment_type_us');
                if (payment_type_us == 72) {
                    nlapiGetField('custpage_bank_name_us').setDisplayType('hidden')
                    nlapiGetField('custpage_iban_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank1_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank2_us').setDisplayType('hidden')
                    nlapiGetField('custpage_swift_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank_number_us').setDisplayType('normal')
                    nlapiGetField('custpage_bank_account_type_us').setDisplayType('normal')
                    nlapiSetFieldMandatory('custpage_account_number_us', true)
                    nlapiSetFieldMandatory('custpage_bank_number_us', true)
     
                }
                else { 
                    nlapiGetField('custpage_bank_number_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank_account_type_us').setDisplayType('hidden')
                    nlapiGetField('custpage_bank_name_us').setDisplayType('normal')
                    nlapiGetField('custpage_iban_us').setDisplayType('normal')
                    nlapiGetField('custpage_bank1_us').setDisplayType('normal')
                    nlapiGetField('custpage_bank2_us').setDisplayType('normal')
                    nlapiGetField('custpage_swift_us').setDisplayType('normal')
                    nlapiSetFieldMandatory('custpage_account_number_us', false)
                    nlapiSetFieldMandatory('custpage_bank_number_us', false)
                }
            }
        }
        function saveRecord(scriptContext) {
            debugger;
            var page = nlapiGetFieldValue('custpage_next_page')
            if (page == '1') {
                var password = nlapiGetFieldValue('custpage_password')
                var log = nlapiGetFieldValue('custpage_log');
                var passwordByLog = getPassword(log);
                if (passwordByLog != password) {
                    alert('The password that you have provided is invalid.');
                    return false;
                }
            }
            else {
                country = nlapiGetFieldValue('custpage_country');
                if (country == 'US' || country == 'JP' || country == 'MX' || country == 'GB' || country == 'AT' || country == 'CA' || country == 'CN' || country == 'IN') {
                    if (!ValidationField('custpage_state_select')) { return; }
                }
                custpage_sub = nlapiGetFieldValue('custpage_sub');
                if (custpage_sub == 18 ) {
                    country = nlapiGetFieldValue('custpage_country_ligal');
                    if (country == 'US' || country == 'JP' || country == 'MX' || country == 'GB' || country == 'AT' || country == 'CA' || country == 'CN' || country == 'IN') {
                        if (!ValidationField('custpage_state_select_ligal')) { return; }
                    }
                }
                payment_type_us = nlapiGetFieldValue('custpage_payment_type_us');
                if (payment_type_us == 72) {
                    if (!ValidationField('custpage_account_number_us')) { return; }
                    if (!ValidationField('custpage_bank_number_us')) { return; }
                }
            }          
            return true     
        }
        var nsStates = {
            'US': [{ "value": "", "text": "" }, { "value": "AL", "text": "Alabama" }, { "value": "AK", "text": "Alaska" }, { "value": "AZ", "text": "Arizona" }, { "value": "AR", "text": "Arkansas" }, { "value": "AA", "text": "Armed Forces Americas" }, { "value": "AE", "text": "Armed Forces Europe" }, { "value": "AP", "text": "Armed Forces Pacific" }, { "value": "CA", "text": "California" }, { "value": "CO", "text": "Colorado" }, { "value": "CT", "text": "Connecticut" }, { "value": "DE", "text": "Delaware" }, { "value": "DC", "text": "District of Columbia" }, { "value": "FL", "text": "Florida" }, { "value": "GA", "text": "Georgia" }, { "value": "HI", "text": "Hawaii" }, { "value": "ID", "text": "Idaho" }, { "value": "IL", "text": "Illinois" }, { "value": "IN", "text": "Indiana" }, { "value": "IA", "text": "Iowa" }, { "value": "KS", "text": "Kansas" }, { "value": "KY", "text": "Kentucky" }, { "value": "LA", "text": "Louisiana" }, { "value": "ME", "text": "Maine" }, { "value": "MD", "text": "Maryland" }, { "value": "MA", "text": "Massachusetts" }, { "value": "MI", "text": "Michigan" }, { "value": "MN", "text": "Minnesota" }, { "value": "MS", "text": "Mississippi" }, { "value": "MO", "text": "Missouri" }, { "value": "MT", "text": "Montana" }, { "value": "NE", "text": "Nebraska" }, { "value": "NV", "text": "Nevada" }, { "value": "NH", "text": "New Hampshire" }, { "value": "NJ", "text": "New Jersey" }, { "value": "NM", "text": "New Mexico" }, { "value": "NY", "text": "New York" }, { "value": "NC", "text": "North Carolina" }, { "value": "ND", "text": "North Dakota" }, { "value": "OH", "text": "Ohio" }, { "value": "OK", "text": "Oklahoma" }, { "value": "OR", "text": "Oregon" }, { "value": "PA", "text": "Pennsylvania" }, { "value": "PR", "text": "Puerto Rico" }, { "value": "RI", "text": "Rhode Island" }, { "value": "SC", "text": "South Carolina" }, { "value": "SD", "text": "South Dakota" }, { "value": "TN", "text": "Tennessee" }, { "value": "TX", "text": "Texas" }, { "value": "UT", "text": "Utah" }, { "value": "VT", "text": "Vermont" }, { "value": "VA", "text": "Virginia" }, { "value": "WA", "text": "Washington" }, { "value": "WV", "text": "West Virginia" }, { "value": "WI", "text": "Wisconsin" }, { "value": "WY", "text": "Wyoming" }],
            'JP': [{ "value": "", "text": "" }, { "value": "北海道", "text": "Hokkaidō" }, { "value": "青森県", "text": "Aomori" }, { "value": "岩手県", "text": "Iwate" }, { "value": "宮城県", "text": "Miyagi" }, { "value": "秋田県", "text": "Akita" }, { "value": "山形県", "text": "Yamagata" }, { "value": "福島県", "text": "Fukushima" }, { "value": "茨城県", "text": "Ibaraki" }, { "value": "栃木県", "text": "Tochigi" }, { "value": "群馬県", "text": "Gunma" }, { "value": "埼玉県", "text": "Saitama" }, { "value": "千葉県", "text": "Chiba" }, { "value": "東京都", "text": "Tokyo" }, { "value": "神奈川県", "text": "Kanagawa" }, { "value": "新潟県", "text": "Niigata" }, { "value": "富山県", "text": "Toyama" }, { "value": "石川県", "text": "Ishikawa" }, { "value": "福井県", "text": "Fukui" }, { "value": "山梨県", "text": "Yamanashi" }, { "value": "長野県", "text": "Nagano" }, { "value": "岐阜県", "text": "Gifu" }, { "value": "静岡県", "text": "Shizuoka" }, { "value": "愛知県", "text": "Aichi" }, { "value": "三重県", "text": "Mie" }, { "value": "滋賀県", "text": "Shiga" }, { "value": "京都府", "text": "Kyoto" }, { "value": "大阪府", "text": "Osaka" }, { "value": "兵庫県", "text": "Hyōgo" }, { "value": "奈良県", "text": "Nara" }, { "value": "和歌山県", "text": "Wakayama" }, { "value": "鳥取県", "text": "Tottori" }, { "value": "島根県", "text": "Shimane" }, { "value": "岡山県", "text": "Okayama" }, { "value": "広島県", "text": "Hiroshima" }, { "value": "山口県", "text": "Yamaguchi" }, { "value": "徳島県", "text": "Tokushima" }, { "value": "香川県", "text": "Kagawa" }, { "value": "愛媛県", "text": "Ehime" }, { "value": "高知県", "text": "Kochi" }, { "value": "福岡県", "text": "Fukuoka" }, { "value": "佐賀県", "text": "Saga" }, { "value": "長崎県", "text": "Nagasaki" }, { "value": "熊本県", "text": "Kumamoto" }, { "value": "大分県", "text": "Ōita" }, { "value": "宮崎県", "text": "Miyazaki" }, { "value": "鹿児島県", "text": "Kagoshima" }, { "value": "沖縄県", "text": "Okinawa" }],
            'MX': [{ "value": "", "text": "" }, { "value": "AGS", "text": "Aguascalientes" }, { "value": "BCN", "text": "Baja California Norte" }, { "value": "BCS", "text": "Baja California Sur" }, { "value": "CAM", "text": "Campeche" }, { "value": "CHIS", "text": "Chiapas" }, { "value": "CHIH", "text": "Chihuahua" }, { "value": "COAH", "text": "Coahuila" }, { "value": "COL", "text": "Colima" }, { "value": "DF", "text": "Distrito Federal" }, { "value": "DGO", "text": "Durango" }, { "value": "GTO", "text": "Guanajuato" }, { "value": "GRO", "text": "Guerrero" }, { "value": "HGO", "text": "Hidalgo" }, { "value": "JAL", "text": "Jalisco" }, { "value": "MICH", "text": "Michoacán" }, { "value": "MOR", "text": "Morelos" }, { "value": "MEX", "text": "México (Estado de)" }, { "value": "NAY", "text": "Nayarit" }, { "value": "NL", "text": "Nuevo León" }, { "value": "OAX", "text": "Oaxaca" }, { "value": "PUE", "text": "Puebla" }, { "value": "QRO", "text": "Querétaro" }, { "value": "QROO", "text": "Quintana Roo" }, { "value": "SLP", "text": "San Luis Potosí" }, { "value": "SIN", "text": "Sinaloa" }, { "value": "SON", "text": "Sonora" }, { "value": "TAB", "text": "Tabasco" }, { "value": "TAMPS", "text": "Tamaulipas" }, { "value": "TLAX", "text": "Tlaxcala" }, { "value": "VER", "text": "Veracruz" }, { "value": "YUC", "text": "Yucatán" }, { "value": "ZAC", "text": "Zacatecas" }],
            'GB': [{ "value": "", "text": "" }, { "value": "Aberdeenshire", "text": "Aberdeenshire" }, { "value": "Angus", "text": "Angus" }, { "value": "Argyll", "text": "Argyll" }, { "value": "Avon", "text": "Avon" }, { "value": "Ayrshire", "text": "Ayrshire" }, { "value": "Banffshire", "text": "Banffshire" }, { "value": "Beds.", "text": "Bedfordshire" }, { "value": "Berks.", "text": "Berkshire" }, { "value": "Berwickshire", "text": "Berwickshire" }, { "value": "Bucks.", "text": "Buckinghamshire" }, { "value": "Caithness", "text": "Caithness" }, { "value": "Cambs.", "text": "Cambridgeshire" }, { "value": "Ches.", "text": "Cheshire" }, { "value": "Clackmannanshire", "text": "Clackmannanshire" }, { "value": "Cleveland", "text": "Cleveland" }, { "value": "Clwyd", "text": "Clwyd" }, { "value": "Cornwall", "text": "Cornwall" }, { "value": "Co Antrim", "text": "County Antrim" }, { "value": "Co Armagh", "text": "County Armagh" }, { "value": "Co Down", "text": "County Down" }, { "value": "Durham", "text": "County Durham" }, { "value": "Co Fermanagh", "text": "County Fermanagh" }, { "value": "Co Londonderry", "text": "County Londonderry" }, { "value": "Co Tyrone", "text": "County Tyrone" }, { "value": "Cumbria", "text": "Cumbria" }, { "value": "Derbys.", "text": "Derbyshire" }, { "value": "Devon", "text": "Devon" }, { "value": "Dorset", "text": "Dorset" }, { "value": "Dumfriesshire", "text": "Dumfriesshire" }, { "value": "Dunbartonshire", "text": "Dunbartonshire" }, { "value": "Dyfed", "text": "Dyfed" }, { "value": "E Lothian", "text": "East Lothian" }, { "value": "E Sussex", "text": "East Sussex" }, { "value": "Essex", "text": "Essex" }, { "value": "Fife", "text": "Fife" }, { "value": "Gloucs.", "text": "Gloucestershire" }, { "value": "London", "text": "Greater London" }, { "value": "Gwent", "text": "Gwent" }, { "value": "Gwynedd", "text": "Gwynedd" }, { "value": "Hants.", "text": "Hampshire" }, { "value": "Hereford", "text": "Herefordshire" }, { "value": "Herts.", "text": "Hertfordshire" }, { "value": "Inverness-shire", "text": "Inverness-shire" }, { "value": "Isle of Arran", "text": "Isle of Arran" }, { "value": "Isle of Barra", "text": "Isle of Barra" }, { "value": "Isle of Benbecula", "text": "Isle of Benbecula" }, { "value": "Isle of Bute", "text": "Isle of Bute" }, { "value": "Isle of Canna", "text": "Isle of Canna" }, { "value": "Isle of Coll", "text": "Isle of Coll" }, { "value": "Isle of Colonsay", "text": "Isle of Colonsay" }, { "value": "Isle of Cumbrae", "text": "Isle of Cumbrae" }, { "value": "Isle of Eigg", "text": "Isle of Eigg" }, { "value": "Isle of Gigha", "text": "Isle of Gigha" }, { "value": "Isle of Harris", "text": "Isle of Harris" }, { "value": "Isle of Iona", "text": "Isle of Iona" }, { "value": "Isle of Islay", "text": "Isle of Islay" }, { "value": "Isle of Jura", "text": "Isle of Jura" }, { "value": "Isle of Lewis", "text": "Isle of Lewis" }, { "value": "Isle of Mull", "text": "Isle of Mull" }, { "value": "Isle of North Uist", "text": "Isle of North Uist" }, { "value": "Isle of Rum", "text": "Isle of Rum" }, { "value": "Isle of Scalpay", "text": "Isle of Scalpay" }, { "value": "Isle of Skye", "text": "Isle of Skye" }, { "value": "Isle of South Uist", "text": "Isle of South Uist" }, { "value": "Isle of Tiree", "text": "Isle of Tiree" }, { "value": "Isle of Wight", "text": "Isle of Wight" }, { "value": "Kent", "text": "Kent" }, { "value": "Kincardineshire", "text": "Kincardineshire" }, { "value": "Kinross-shire", "text": "Kinross-shire" }, { "value": "Kirkcudbrightshire", "text": "Kirkcudbrightshire" }, { "value": "Lanarkshire", "text": "Lanarkshire" }, { "value": "Lancs.", "text": "Lancashire" }, { "value": "Leics.", "text": "Leicestershire" }, { "value": "Lincs.", "text": "Lincolnshire" }, { "value": "Merseyside", "text": "Merseyside" }, { "value": "M Glam", "text": "Mid Glamorgan" }, { "value": "Mid Lothian", "text": "Mid Lothian" }, { "value": "Middx.", "text": "Middlesex" }, { "value": "Morayshire", "text": "Morayshire" }, { "value": "Nairnshire", "text": "Nairnshire" }, { "value": "Norfolk", "text": "Norfolk" }, { "value": "N Humberside", "text": "North Humberside" }, { "value": "N Yorkshire", "text": "North Yorkshire" }, { "value": "Northants.", "text": "Northamptonshire" }, { "value": "Northumberland", "text": "Northumberland" }, { "value": "Notts.", "text": "Nottinghamshire" }, { "value": "Oxon.", "text": "Oxfordshire" }, { "value": "Peeblesshire", "text": "Peeblesshire" }, { "value": "Perthshire", "text": "Perthshire" }, { "value": "Powys", "text": "Powys" }, { "value": "Renfrewshire", "text": "Renfrewshire" }, { "value": "Ross-shire", "text": "Ross-shire" }, { "value": "Roxburghshire", "text": "Roxburghshire" }, { "value": "Selkirkshire", "text": "Selkirkshire" }, { "value": "Shrops", "text": "Shropshire" }, { "value": "Somt.", "text": "Somerset" }, { "value": "S Glam", "text": "South Glamorgan" }, { "value": "S Humberside", "text": "South Humberside" }, { "value": "S Yorkshire", "text": "South Yorkshire" }, { "value": "Staffs.", "text": "Staffordshire" }, { "value": "Stirlingshire", "text": "Stirlingshire" }, { "value": "Suffolk", "text": "Suffolk" }, { "value": "Surrey", "text": "Surrey" }, { "value": "Sutherland", "text": "Sutherland" }, { "value": "Tyne & Wear", "text": "Tyne and Wear" }, { "value": "Warks", "text": "Warwickshire" }, { "value": "W Glam", "text": "West Glamorgan" }, { "value": "W Lothian", "text": "West Lothian" }, { "value": "W Midlands", "text": "West Midlands" }, { "value": "W Sussex", "text": "West Sussex" }, { "value": "W Yorkshire", "text": "West Yorkshire" }, { "value": "Wigtownshire", "text": "Wigtownshire" }, { "value": "Wilts", "text": "Wiltshire" }, { "value": "Worcs", "text": "Worcestershire" }],
            'AT': [{ "value": "", "text": "" }, { "value": "ACT", "text": "Australian Capital Territory" }, { "value": "NSW", "text": "New South Wales" }, { "value": "NT", "text": "Northern Territory" }, { "value": "QLD", "text": "Queensland" }, { "value": "SA", "text": "South Australia" }, { "value": "TAS", "text": "Tasmania" }, { "value": "VIC", "text": "Victoria" }, { "value": "WA", "text": "Western Australia" }],
            'CA': [{ "value": "", "text": "" }, { "value": "AB", "text": "Alberta" }, { "value": "BC", "text": "British Columbia" }, { "value": "MB", "text": "Manitoba" }, { "value": "NB", "text": "New Brunswick" }, { "value": "NL", "text": "Newfoundland" }, { "value": "NT", "text": "Northwest Territories" }, { "value": "NS", "text": "Nova Scotia" }, { "value": "NU", "text": "Nunavut" }, { "value": "ON", "text": "Ontario" }, { "value": "PE", "text": "Prince Edward Island" }, { "value": "QC", "text": "Quebec" }, { "value": "SK", "text": "Saskatchewan" }, { "value": "YT", "text": "Yukon" }],
            'CN': [{ "value": "", "text": "" }, { "value": "黑龙江省", "text": "Heilongjiang Province" }, { "value": "吉林省", "text": "Jilin Province" }, { "value": "辽宁省", "text": "Liaoning Province" }, { "value": "内蒙古", "text": "Neimenggu A. R." }, { "value": "甘肃省", "text": "Gansu Province" }, { "value": "宁夏回族自治区", "text": "Ningxia A. R." }, { "value": "新疆维吾尔族自治区", "text": "Xinjiang A. R." }, { "value": "青海省", "text": "Qinghai Province" }, { "value": "河北省", "text": "Hebei Province" }, { "value": "河南省", "text": "Henan Province" }, { "value": "山东省", "text": "Shandong Province" }, { "value": "山西省", "text": "Shanxi Province" }, { "value": "陕西省", "text": "Shaanxi Province" }, { "value": "江苏省", "text": "Jiangsu Province" }, { "value": "浙江省", "text": "Zhejiang Province" }, { "value": "安徽省", "text": "Anhui Province" }, { "value": "湖北省", "text": "Hubei Province" }, { "value": "湖南省", "text": "Hunan Province" }, { "value": "四川省", "text": "Sichuan Province" }, { "value": "贵州省", "text": "Guizhou Province" }, { "value": "江西省", "text": "Jiangxi Province" }, { "value": "广东省", "text": "Guangdong Province" }, { "value": "广西壮族自治区", "text": "Guangxi A. R." }, { "value": "云南省", "text": "Yunnan Province" }, { "value": "海南省", "text": "Hainan Province" }, { "value": "西藏藏族自治区", "text": "Xizang A. R." }, { "value": "北京市", "text": "Beijing" }, { "value": "上海市", "text": "Shanghai" }, { "value": "天津市", "text": "Tianjin" }, { "value": "重庆市", "text": "Chongqing" }, { "value": "福建省", "text": "Fujian Province" }],
            'IN': [{ "value": "", "text": "" }, { "value": "AP", "text": "Andhra Pradesh" }, { "value": "AR", "text": "Arunachal Pradesh" }, { "value": "BR", "text": "Bihar" }, { "value": "AS", "text": "Assam" }, { "value": "CT", "text": "Chhattisgarh" }, { "value": "GA", "text": "Goa" }, { "value": "GJ", "text": "Gujarat" }, { "value": "HR", "text": "Haryana" }, { "value": "HP", "text": "Himachal Pradesh" }, { "value": "JK", "text": "Jammu and Kashmir" }, { "value": "JH", "text": "Jharkhand" }, { "value": "KA", "text": "Karnataka" }, { "value": "KL", "text": "Kerala" }, { "value": "MP", "text": "Madhya Pradesh" }, { "value": "MH", "text": "Maharashtra" }, { "value": "MN", "text": "Manipur" }, { "value": "ML", "text": "Meghalaya" }, { "value": "MZ", "text": "Mizoram" }, { "value": "NL", "text": "Nagaland" }, { "value": "OR", "text": "Odisha" }, { "value": "PB", "text": "Punjab" }, { "value": "RJ", "text": "Rajasthan" }, { "value": "SK", "text": "Sikkim" }, { "value": "TN", "text": "Tamil Nadu" }, { "value": "TG", "text": "Telangana" }, { "value": "TR", "text": "Tripura" }, { "value": "UT", "text": "Uttarakhand" }, { "value": "UP", "text": "Uttar Pradesh" }, { "value": "WB", "text": "West Bengal" }, { "value": "AN", "text": "Andaman and Nicobar Islands" }, { "value": "CH", "text": "Chandigarh" }, { "value": "DN", "text": "Dadra and Nagar Haveli" }, { "value": "DD", "text": "Daman and Diu" }, { "value": "DL", "text": "Delhi" }, { "value": "LD", "text": "Lakshadweep" }, { "value": "PY", "text": "Puducherry" }]
        }     
        function addOptions(currentRecord, country , field) {
            nlapiRemoveSelectOption(field)
            var field = currentRecord.getField({
                fieldId: field
            });
            var list = nsStates[country]
            for (var i = 0; i < list.length; i++) {
                field.insertSelectOption({ value: list[i].value, text: list[i].text });
            }
        }
        function getPassword(log) {
            var SearchObj = search.create({
                type: "customrecord_vendors_quick_add_logs",
                filters:
                    [
                        ["internalid", "anyof", log]
                    ],
                columns:
                    [
                       "custrecord_vend_password"
                    ]
            });           
            SearchObj.run().each(function (result) {
                pass = result.getValue({ name: "custrecord_vend_password" });
                return true;
            });
             
            return pass;
        }
        function ValidationField(field) {
            var val = nlapiGetFieldValue(field)
            if (isNullOrEmpty(val)) {
                var label = nlapiGetField(field).label.toUpperCase();
                alert("Please enter value(s) for: " + label)
                return false;
            }
            return true;
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };
    });