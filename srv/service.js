const fs = require('fs')
const path = require('path')
const axios = require('axios');

module.exports = async function (srv) {
    const { pdfinfoSrv } = this.entities;

    const AdobeApi = await cds.connect.to('AdobeApi');
    const RealApiAdobeCall = await cds.connect.to('RealApiAdobeCall');

    let Token = ""

    // Implementing the getStatus function
    srv.on('CREATE', pdfinfoSrv, GetPdfInfo);

    async function GetPdfInfo(req, res) {
        try {
            const {
                Transport,
                IsDriverCertificate,
                IsAreaClean,
                IsLoadSpace,
                TestedBy,
                IsInspectionValid,
                IsTiresOk,
                IsLightingFine,
                IsLeaksNotVisible,
                IsLoadingAreaClean,
                IsFireExtinguishersSign,
                IsProtectiveEquipment,
                IsSecuredLoading,
                IsWarningSign,
                Signature,
            } = req.data;

            // Convert Boolean values to 1 or 0
            const YesDriverCertificate = IsDriverCertificate ? 1 : 0;
            const NoDriverCertificate = !IsDriverCertificate ? 1 : 0;

            const YesAreaClean = IsAreaClean ? 1 : 0;
            const NoAreaClean = !IsAreaClean ? 1 : 0;

            const YesLoadSpace = IsLoadSpace ? 1 : 0;
            const NoLoadSpace = !IsLoadSpace ? 1 : 0;

            const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
                                    <form1>
                                    <Transport>${Transport}</Transport>
                                    <YesDriverCertificate>${YesDriverCertificate}</YesDriverCertificate>
                                    <NoDriverCertificate>${NoDriverCertificate}</NoDriverCertificate>
                                    <TestedBy>${TestedBy}</TestedBy>
                                    <YesAreaClean>${YesAreaClean}</YesAreaClean>
                                    <NoAreaClean>${NoAreaClean}</NoAreaClean>
                                    <YesLoadspace>${YesLoadSpace}</YesLoadspace>
                                    <NoLoadspace>${NoLoadSpace}</NoLoadspace>
                                    <InspectionValid>${IsInspectionValid?1:0}</InspectionValid>
                                    <TiresOk>${IsTiresOk?1:0}</TiresOk>
                                    <LightingFine>${IsLightingFine?1:0}</LightingFine>
                                    <LeaksNotVisible>${IsLeaksNotVisible?1:0}</LeaksNotVisible>
                                    <LoadingAreaClean>${IsLoadingAreaClean?1:0}</LoadingAreaClean>
                                    <FireExtinguishersSign>${IsFireExtinguishersSign?1:0}</FireExtinguishersSign>
                                    <ProtectiveEquipment>${IsProtectiveEquipment?1:0}</ProtectiveEquipment>
                                    <SecuredLoading>${IsSecuredLoading?1:0}</SecuredLoading>
                                    <WarningSign>${IsWarningSign?1:0}</WarningSign>
                                    <Signature>${Signature}</Signature>
                                    </form1>`



            const base64Xml = Buffer.from(xmlData).toString('base64');



            let result = await onAdobeAPICall(req, res, base64Xml);
            return result;



        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while generating the PDF." });
        }
    }




    async function onAdobeAPICall(req, res, base64Xml) {
        console.log(base64Xml);

        try {
            const response = await axios.post(`${AdobeApi.options.credentials.url}`,
                new URLSearchParams({
                    'grant_type': 'client_credentials',
                    'client_id': 'sb-e7fa4ffd-0d29-4e80-9923-bdd04a2f4cf0!b43709|ads-xsappname!b41012',
                    'client_secret': 'e22fc330-53b7-4cc8-9a64-01c836355c96$XMse0mXSfKkkVZJNfjT66nUy2PnZWg3cxo_XJiIvN0Y='
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            Token = response.data.access_token;

            rdata = await RealAdobeCall(req, res, Token, base64Xml);
            return rdata;



        } catch (error) {
            console.error('Error calling Adobe API:', error.message);
            return false;
        }
    };


    async function RealAdobeCall(req, res, Token, base64Xml) {


        try {
            console.log("Reached!!");



            B64_XdpTemp = await getTemplateData()
            // B64_xmlData = Buffer.from(xmlData, 'binary').toString('base64');




            // Defining the payload
            const payload = {
                xdpTemplate: B64_XdpTemp,   // Base64 encoded XDP template
                xmlData: base64Xml,    // Base64 encoded XML data
                formType: 'print',         // Type of form (e.g., "print")
                formLocale: 'en_US',     // Locale (e.g., "en_US")
                taggedPdf: 1,       // Whether the PDF should be tagged
                embedFont: 0,       // Whether fonts should be embedded
                changeNotAllowed: false, // Flag for disallowing changes
                printNotAllowed: false    // Flag for disallowing printing
            };
            console.log(payload);


            // Making the POST request to the Adobe API endpoint with Bearer token authentication
            const response = await axios.post(`${RealApiAdobeCall.options.credentials.url}`,
                payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}` // Adding the Bearer token to the headers
                }
            });
            console.log(response);

            // Return the base64 content from the response
            console.log("Hello");
            const base64PDF = response.data;
            console.log(response); // Assuming response is already in Base64 format
            return base64PDF
            // return res.status(200).json({ base64PDF }); // Sending Base64 PDF in response
        } catch (error) {
            console.error('Error generating Base64 PDF:', error);
            // return req.status(500).json({ message: 'Error generating PDF', error: error.message });
        }
    }




};
async function readFileAsBase64(filePath) {
    try {

        const data = fs.readFileSync(filePath);

        const base64Data = data.toString('base64');

        return base64Data;
    } catch (err) {
        console.error('Error reading file:', err.message);
        throw err;
    }
}

async function getTemplateData() {
    const filePath = path.join('/home/user/projects/adobe-apis/testing.xdp');
    try {
        const base64Content = await readFileAsBase64(filePath);
        return base64Content;
    } catch (error) {
        console.log("Error while reading file " + error.message);
    }

}