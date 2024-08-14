const siteConfigurations = {
    'alliedtrustagents.com': {
        elementMappings: {
            // Customer info
            first_name: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsFirstName',
            last_name: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsLastName',
            dob: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_dtInsBirthDt',
            phone: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_InsHomePhone',
            email: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsEmail',
            address1: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyAddress1',
            address2: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtAddress2',
            city: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyCity',
            zip: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyZip',

            // Hard code Value
            dA: 'ContentPlaceHolderBody_QuoteBody_txtDwellingCvg',
            dB: 'ContentPlaceHolderBody_QuoteBody_ddlCoverageBLimitCd',
            dC: 'ContentPlaceHolderBody_QuoteBody_ddlCoverageCLimitCd',
            dD: 'ContentPlaceHolderBody_QuoteBody_ddlLossOfUseCvgCd',
            dE: 'ContentPlaceHolderBody_QuoteBody_ddlLiabilityCvgCd',
            dF: 'ContentPlaceHolderBody_QuoteBody_ddlMedicalCvgCd',
            aop: 'ContentPlaceHolderBody_QuoteBody_ddlDeductibleAOPCd',
            wh: 'ContentPlaceHolderBody_QuoteBody_ddlDeductibleWindHailCd',

            // House info
            year_built: 'ContentPlaceHolderBody_QuoteBody_dtConstructionDt',
            purchase_date: 'ContentPlaceHolderBody_QuoteBody_dtHouseClosingDate',
            const_material: 'ContentPlaceHolderBody_QuoteBody_ddlConstructionTypeCd',
            foundation: 'ContentPlaceHolderBody_QuoteBody_ddlFoundationType',
            sqft: 'ContentPlaceHolderBody_QuoteBody_txtTotalAreaSqFt',
            st: 'ContentPlaceHolderBody_QuoteBody_ddlNbrFloorsCd',
            mat: 'ContentPlaceHolderBody_QuoteBody_ddlSidingType',
            roof_shape: 'ContentPlaceHolderBody_QuoteBody_ddlRoofShapeCd',
            roof_mat: 'ContentPlaceHolderBody_QuoteBody_ddlRoofType',
            roof_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovRoofYear',

            // Unique to allied website
            payplan: 'ContentPlaceHolderBody_QuoteBody_ddlPaymentPlan',
            payor: 'ContentPlaceHolderBody_QuoteBody_ddlPayorCd',
            housesize: 'ContentPlaceHolderBody_QuoteBody_ddlHouseHoldSizeCd',
            personal_statues: 'ContentPlaceHolderBody_QuoteBody_ddlMarried',
            Inspermission: 'ContentPlaceHolderBody_QuoteBody_ddlHasAssentedtoCreditScore',
            Ins_score: 'ContentPlaceHolderBody_QuoteBody_ddlCreditScore',
            heater_location: 'ContentPlaceHolderBody_QuoteBody_ddlFirstWaterHeaterLocation',
            resident_type: 'ContentPlaceHolderBody_QuoteBody_ddlResidenceType',
            usage: 'ContentPlaceHolderBody_QuoteBody_ddlUsageType',
            water_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovationWaterHeaterYear',

            // Hard code no option for allied website
            option1: 'ContentPlaceHolderBody_QuoteBody_ddlAnyPersonalPropertyReplacementCvg',
            option2: 'ContentPlaceHolderBody_QuoteBody_ddlAnyBreakdownCvg',
            waterCov: 'ContentPlaceHolderBody_QuoteBody_HasPlumbingLeakageCoverage',
        },
        
    },

    'agents.sagesure.com': {
        elementMappings: {
            // Customer info
            first_name: 'InsuredFirstName',
            last_name: 'InsuredLastName',
            dob: 'Insured1BirthDate',
            personal_statues: 'InsuredMaritalStatus',
            
            // Hard code Value
            dA: 'CoverageA',
            ddA: 'CoverageADisplay',

            // React Select fields
            year_built: 'ConstructionYear',
            const_material: 'ConstructionType',
            c1: 'MasonryVeneerPercentage',
            roof_mat: 'RoofCoveringType',
            roof_year: 'ConstructionYearRoof',
            

            // Unique on Sagesure
            Ins_score: 'InsuranceScoreRangeEstimate',
            Laps: 'LapseInCoverage',
            Co_app: 'CoApplicantIndicator',
            PriorCarrier: 'PriorCarrierOther',
            x1: 'InsuranceScoreRangeEstimateIndicator',
            x2: 'Insured1SSNRequiredIndicator',
            x3: 'PersonalPropertyReplacementCost',
            x4: 'Trampoline'

        },
        
    }
};

// Get the current domain of the page
function getCurrentDomain() {
    return window.location.hostname;
}

// Get element mappings for the current site
function getElementMappings(site) {
    const currentDomain = getCurrentDomain();

    for (const [domain, config] of Object.entries(siteConfigurations)) {
        if (currentDomain.includes(domain)) {
            return config.elementMappings;
        }
    }
    return null;
}

function isReactSelect(element) {
    return element.classList.contains('uit-react-select__input');
}

// React shit
// Fill a React Select field
function fillReactSelect(elementId, value) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.log(`Container for ${elementId} not found`);
        return false;
    }

    const input = container.querySelector("input[type='text']");
    if (!input) {
        console.log(`Input for ${elementId} not found`);
        return false;
    }

    // Set the value and dispatch events
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Simulate a click to open the dropdown
    input.click();

    // Find and click the matching option
    setTimeout(() => {
        const options = document.querySelectorAll('.uit-react-select__option');
        for (let option of options) {
            if (option.textContent.trim().toLowerCase() === value.toLowerCase()) {
                option.click();
                console.log(`Option ${value} selected for ${elementId}`);
                return true;
            }
        }
        console.log(`Option ${value} not found for ${elementId}`);
        return false;
    }, 100);  // Small delay to allow dropdown to open

    return true;
}
// Radio selector for React
function selectRadioButton(name, value) {
    const radioButtons = document.querySelectorAll(`input[name='${name}']`);
    for (let radio of radioButtons) {
        if (radio.value === value || radio.nextSibling.textContent.trim().toLowerCase() === value.toLowerCase()) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Radio button ${name} selected with value: ${value}`);
            return true;
        }
    }
    console.log(`No matching radio button found for ${name} with value: ${value}`);
    return false;
}

// Find an element by ID, name, or React Select container
function findElement(elementId) {
    let element = document.getElementById(elementId) || document.getElementsByName(elementId)[0];
    
    if (element) {
        return element;
    }

    // Check for React Select container
    const reactSelectContainer = document.getElementById(`${elementId}-container`);
    if (reactSelectContainer) {
        return { isReactSelect: true, containerId: `${elementId}-container` };
    }

    return null;
}

// Fill a field with the provided value
function fillField(element, value, site, key) {
    console.log(`Attempting to fill ${key} with value: ${value}`);
    
    const siteConfig = siteConfigurations[site];
    if (siteConfig && siteConfig.valueMappings) {
        const mappings = siteConfig.valueMappings[key];
        if (mappings) {
            value = mappings[value] || value;
        }
    }

    if (element.isReactSelect) {
        return fillReactSelect(element.containerId, value);
    } else if (isReactSelect(element)) {
        return fillReactSelect(element.id, value);
    } else if (element.tagName === 'SELECT') {
        const option = Array.from(element.options).find(option =>
            option.value.toLowerCase() === value.toLowerCase() ||
            option.textContent.toLowerCase() === value.toLowerCase()
        );
        if (option) {
            element.value = option.value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } else {
            return false;
        }
    } else if (element.type === 'radio') {
        return selectRadioButton(element.name, value);
    } else {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`Field ${key} filled with: ${value}`);
        return true;
    }
}


// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    try {
        const site = request.site;
        const elementMappings = getElementMappings(site);
        if (!elementMappings) {
            sendResponse({ status: 'Error', message: 'No configuration for this site' });
            return true;
        }

        console.log('Received data:', request);

        let filledFields = 0;
        let notFoundElements = [];

        for (const [key, elementId] of Object.entries(elementMappings)) {
            const element = findElement(elementId);

            if (element && request[key] !== undefined) {
                console.log(`Processing ${key}: ${request[key]}`);
                if (fillField(element, request[key], site, key)) {
                    filledFields++;
                }
            } else if (!element) {
                console.log(`Element not found: ${elementId}`);
                notFoundElements.push(elementId);
            }
        }

        sendResponse({
            status: 'Success',
            message: `Filled ${filledFields} fields. ${notFoundElements.length} elements not found.`,
            notFoundElements: notFoundElements
        });
    } catch (error) {
        console.error('Error in content script:', error);
        sendResponse({ status: 'Error', message: error.message });
    }

    return true;
});