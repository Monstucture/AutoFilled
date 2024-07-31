const siteConfigurations = {
    'alliedtrustagents.com': {
        elementMappings: {
            // Customer info
            first_name: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsFirstName",
            last_name: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsLastName",
            dob: "ContentPlaceHolderBody_ApplicantPropertyLoc1_dtInsBirthDt",
            phone: "ContentPlaceHolderBody_ApplicantPropertyLoc1_InsHomePhone",
            email: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsEmail",
            address1: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyAddress1",
            address2: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtAddress2",
            city: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyCity",
            zip: "ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyZip",

            // Hard code Value
            dA: "ContentPlaceHolderBody_QuoteBody_txtDwellingCvg",
            dB: "ContentPlaceHolderBody_QuoteBody_ddlCoverageBLimitCd",
            dC: "ContentPlaceHolderBody_QuoteBody_ddlCoverageCLimitCd",
            dD: "ContentPlaceHolderBody_QuoteBody_ddlLossOfUseCvgCd",
            dE: "ContentPlaceHolderBody_QuoteBody_ddlLiabilityCvgCd",
            dF: "ContentPlaceHolderBody_QuoteBody_ddlMedicalCvgCd",
            aop: "ContentPlaceHolderBody_QuoteBody_ddlDeductibleAOPCd",
            wh: "ContentPlaceHolderBody_QuoteBody_ddlDeductibleWindHailCd",

            // House info
            year_built: "ContentPlaceHolderBody_QuoteBody_dtConstructionDt",
            purchase_date: "ContentPlaceHolderBody_QuoteBody_dtHouseClosingDate",
            const_material: "ContentPlaceHolderBody_QuoteBody_ddlConstructionTypeCd",
            foundation: "ContentPlaceHolderBody_QuoteBody_ddlFoundationType",
            sqft: "ContentPlaceHolderBody_QuoteBody_txtTotalAreaSqFt",
            st: "ContentPlaceHolderBody_QuoteBody_ddlNbrFloorsCd", 
            mat: "ContentPlaceHolderBody_QuoteBody_ddlSidingType",
            roof_shape: "ContentPlaceHolderBody_QuoteBody_ddlRoofShapeCd",
            roof_mat: "ContentPlaceHolderBody_QuoteBody_ddlRoofType",
            roof_year: "ContentPlaceHolderBody_QuoteBody_txtRenovRoofYear",

            // Unique to allied website
            payplan: "ContentPlaceHolderBody_QuoteBody_ddlPaymentPlan",
            payor: "ContentPlaceHolderBody_QuoteBody_ddlPayorCd",
            housesize: "ContentPlaceHolderBody_QuoteBody_ddlHouseHoldSizeCd",
            personal_statues: "ContentPlaceHolderBody_QuoteBody_ddlMarried",
            Inspermission: "ContentPlaceHolderBody_QuoteBody_ddlHasAssentedtoCreditScore",
            Ins_score: "ContentPlaceHolderBody_QuoteBody_ddlCreditScore",
            heater_location: "ContentPlaceHolderBody_QuoteBody_ddlFirstWaterHeaterLocation",
            resident_type: "ContentPlaceHolderBody_QuoteBody_ddlResidenceType",
            usage: "ContentPlaceHolderBody_QuoteBody_ddlUsageType",
            water_year: "ContentPlaceHolderBody_QuoteBody_txtRenovationWaterHeaterYear",

            // Hard code no option for allied website
            option1: "ContentPlaceHolderBody_QuoteBody_ddlAnyPersonalPropertyReplacementCvg",
            option2: "ContentPlaceHolderBody_QuoteBody_ddlAnyBreakdownCvg",
            waterCov: "ContentPlaceHolderBody_QuoteBody_HasPlumbingLeakageCoverage",

        }
    },
    
    'isi.americanriskins.com': {
        elementMappings: {
           // Customer info
           first_name: "ApplicantFirstzzzz1",
           last_name: "ApplicantLastzzzz1",
           dob: "ApplicantBirthDatezzzz1",
           phone: "ApplicantHomePhonezzzz1",
           email: "ApplicantEMailzzzz1",
           address1: "ApplicantAddress1_1",
           address2: "ApplicantAddress2_1",
           city: "ApplicantCity_1",
           zip: "ApplicantZip_1",

           // Hard code Value
           dA: "DwellingLimit_1",
           dB: "AddlContentsLimit_1",
           dC: "PersonalLiabilityLimit_1",
           dD: "MedicalLimit_1",
    
           // House info
           year_built: "ConstructionYear_1",
           purchase_date: "PurchaseDate_1",
           const_material: "ConstructionType_1",
           sqft: "SquareFootage_1",
           st: "NumberStories_1", 
           
           // Hard code for ARI
           foundation: "Foundation_1",
           roof_mat: "RoofCovering_1",
           roof_year: "RoofConstructionYear_1",

           // Unique to ARI
           resident_type: "DwellingType_1", 
           waterCov: "WaterDamageLimit_1",

        }
    }
    // Add more site configurations as needed
};

function getCurrentDomain() {
    return window.location.hostname;
}

function getElementMappings(site) {
    const currentDomain = getCurrentDomain();
    console.log("Current domain:", currentDomain); // Debugging line
    
    for (const [domain, config] of Object.entries(siteConfigurations)) {
        if (currentDomain.includes(domain)) {
            console.log("Matched configuration for domain:", domain); // Debugging line
            return config.elementMappings;
        }
    }
    console.warn("No configuration found for current domain:", currentDomain);
    return null;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    try {
        console.log("Received request:", request);
        const elementMappings = getElementMappings(request.site);
        if (!elementMappings) {
            console.error("No configuration found for site:", request.site);
            sendResponse({status: "Error", message: "No configuration for this site"});
            return true;
        }

        let filledFields = 0;
        for (const [key, elementId] of Object.entries(elementMappings)) {
            const element = document.getElementById(elementId) || document.querySelector(`#${elementId}`);
            if (element && request[key] !== undefined) {
                if (element.tagName === 'SELECT') {
                    const option = Array.from(element.options).find(option => option.value === request[key]);
                    if (option) {
                        element.value = request[key];
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        filledFields++;
                    } else {
                        console.warn(`Option with value "${request[key]}" not found in select element "${elementId}"`);
                    }
                } else {
                    element.value = request[key];
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    filledFields++;
                }
            } else if (!element) {
                console.warn(`Element not found: ${elementId}`);
            }
        }

        console.log(`Filled ${filledFields} fields`);
        sendResponse({status: "Success", message: `Filled ${filledFields} fields`});
    } catch (error) {
        console.error("Error in content script:", error);
        sendResponse({status: "Error", message: error.message});
    }
    
    return true;
});