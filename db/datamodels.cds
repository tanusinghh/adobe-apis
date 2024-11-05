namespace db;

using {cuid} from '@sap/cds/common';


// entity pdfdata : cuid {

//     @Core.MediaType: 'application/xml'
//     xmlData : String;
// }


entity pdfinfo: cuid {
     Transport : String;
     IsDriverCertificate : Boolean;
     IsAreaClean : Boolean;
     IsLoadSpace : Boolean;
     TestedBy : String;
     IsInspectionValid : Boolean;
     IsTiresOk : Boolean;
     IsLightingFine : Boolean;
     IsLeaksNotVisible : Boolean;
     IsLoadingAreaClean : Boolean;
     IsFireExtinguishersSign : Boolean;
     IsProtectiveEquipment : Boolean;
     IsSecuredLoading : Boolean;
     IsWarningSign : Boolean;
     Signature: String ; 

}