document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        autofill: document.getElementById("autofill"),
        resetFields: document.getElementById("reset-fields"),
        save: document.getElementById("save"),
        load: document.getElementById("load"),

        first_name: document.getElementById('first_name'),
        last_name: document.getElementById('last_name'),
        dob: document.getElementById('dob'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        address1: document.getElementById('address1'),
        address2: document.getElementById('address2'),
        city: document.getElementById('city'),
        zip: document.getElementById('zip'),
        dA: document.getElementById('dA'),
        ddA: document.getElementById('dA'),
        dB: document.getElementById('dB'),
        dC: document.getElementById('dC'),
        dD: document.getElementById('dD'),
        dE: document.getElementById('dE'),
        dF: document.getElementById('dF'),
        aop: document.getElementById('aop'),
        wh: document.getElementById('wh'),
        year_built: document.getElementById('year_built'),
        purchase_date: document.getElementById('purchase_date'),
        const_material: document.getElementById('const_material'),
        foundation: document.getElementById('foundation'),
        sqft: document.getElementById('sqft'),
        st: document.getElementById('st'),
        mat: document.getElementById('mat'),
        roof_shape: document.getElementById('roof_shape'),
        roof_mat: document.getElementById('roof_mat'),
        roof_year: document.getElementById('roof_year'),
        water_year: document.getElementById('roof_year'),
        payplan: document.getElementById('payplan'),
        payor: document.getElementById('payor'),
        housesize: document.getElementById('housesize'),
        personal_statues: document.getElementById('personal_statues'),
        Inspermission: document.getElementById('Inspermission'),
        Ins_score: document.getElementById('Ins_score'),
        heater_location: document.getElementById('heater_location'),
        resident_type: document.getElementById('resident_type'),
        usage: document.getElementById('usage'),
        option1: document.getElementById('option1'),
        option2: document.getElementById('option2'),
        waterCov: document.getElementById('waterCov'),

        Laps: document.getElementById('Laps'),
        Co_app: document.getElementById('Co_app'),
        PriorCarrier: document.getElementById('PriorCarrier'),
        c1: document.getElementById('c1'),
        x1: document.getElementById('x1'),
        x2: document.getElementById('x2'),
        x3: document.getElementById('x3'),
        x4: document.getElementById('x4'),

        siteSelection: document.getElementById('site-selection'),
    };

    const siteConfigurations = {
        allied: {
            dB: '2',
            dC: '0',
            dD: '0',
            dE: '1',
            dF: '2',
            aop: '8',
            wh: '4',
            foundation: '2',
            payplan: '0',
            payor: '0',
            housesize: '2',
            personal_statues: '1',
            Inspermission: '1',
            Ins_score: '10',
            heater_location: '1',
            resident_type: '0',
            usage: '0',
            option1: '0',
            option2: '0',
            waterCov: '1',
            roof_mat: [
                { value: '1', label: 'Architectural Shingles' },
                { value: '0', label: 'Asphalt/Composite Shingles' }
            ],
            roof_shape: [
                { value: '0', label:'Gable' },
                { value: '7', label:'Hip' }
            ],
            const_material: [
                { value: '1', label:'Brick' },
                { value: '0', label:'Frame' }
            ],
            mat: [
                { value: '2', label:'Brick' },
                { value: '9', label:'Vinyl' }
            ]
        },
        sagesure: {
            Ins_score: 'Average',
            Laps: 'None',
            Co_app: '200',
            PriorCarrier: 'Other',
    
            c1: '0 - 9%',
            x1: '200',
            x2: '200',
            x3: '200',
            x4: '200',
            

            personal_statues: 'Single',

            const_material: [
                { value: 'Masonry Veneer', label:'Masonry Veneer' },
                { value: 'Frame', label:'Frame' }
            ],
            roof_mat: [
                { value: 'Architectural Shingles', label: 'Architectural Shingles' },
                { value: 'Asphalt/Composite Shingles', label: 'Asphalt/Composite Shingles' }
            ],
        },
    };

    let currentSite = 'allied';

    if (!validateElements(elements)) return;

    initializeFixedValues();
    setupEventListeners();
    updateSelectOptions(['roof_mat', 'roof_shape', 'const_material', 'mat']);

    function validateElements(elements) {
        for (let key in elements) {
            if (!elements[key]) {
                console.error(`Element with id "${key}" not found`);
                return false;
            }
        }
        return true;
    }

    function initializeFixedValues() {
        const config = siteConfigurations[currentSite];
        for (let key in config) {
            if (elements[key] && typeof config[key] !== 'object') {
                elements[key].value = config[key];
            }
        }
    }

    function setupEventListeners() {
        elements.autofill.addEventListener("click", handleAutofill);
        elements.resetFields.addEventListener("click", handleReset);
        elements.save.addEventListener("click", handleSave);
        elements.load.addEventListener("click", handleLoad);
        elements.siteSelection.addEventListener('change', handleSiteChange);
    }

    function handleSiteChange(event) {
        currentSite = event.target.value;
        initializeFixedValues();
        updateSelectOptions(['roof_mat', 'roof_shape']);
    }

    function updateSelectOptions(selectIds) {
        selectIds.forEach(selectId => {
            const selectElement = elements[selectId];
            if (!selectElement) {
                console.error(`Select element ${selectId} not found`);
                return;
            }

            const currentOptions = siteConfigurations[currentSite][selectId];
            if (!currentOptions) {
                console.error(`No options found for ${selectId} in current site configuration`);
                return;
            }

            // Clear existing options
            selectElement.innerHTML = '';

            // Add new options
            for (const option of currentOptions) {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                selectElement.appendChild(optionElement);
            }
        });
    }


    function handleAutofill() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (chrome.runtime.lastError) {
                console.error('Error querying tabs:', chrome.runtime.lastError);
                return;
            }

            if (tabs.length === 0) {
                console.error('No active tab found');
                return;
            }

            const formData = getFormData();
            console.log("Sending form data:", formData);

            chrome.tabs.sendMessage(tabs[0].id, formData, function(response) {
                if (chrome.runtime.lastError) {
                    console.error('Error in sendMessage:', chrome.runtime.lastError);
                    alert('Error: ' + chrome.runtime.lastError.message);
                } else if (!response) {
                    console.error('No response received from content script');
                    alert('Error: No response from content script');
                } else if (response.status === "Success") {
                    console.log("Autofill successful");
                    alert('Autofill successful!');
                } else {
                    console.error('Error in autofill:', response);
                    alert('Error: ' + (response.message || 'Unknown error occurred'));
                }
            });
        });
    }

    function handleReset() {
        for (let key in elements) {
            if (elements[key].value !== undefined && !siteConfigurations[currentSite].hasOwnProperty(key)) {
                elements[key].value = '';
            }
        }
        initializeFixedValues();
        updateSelectOptions(['roof_mat', 'roof_shape']);
    }

    function handleSave() {
        const dataToSave = getFormData();
        chrome.storage.sync.set(dataToSave, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving data:", chrome.runtime.lastError);
            } else {
                console.log("Data saved successfully!");
                alert("Data saved successfully!");
            }
        });
    }

    function handleLoad() {
        chrome.storage.sync.get(null, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error loading data:", chrome.runtime.lastError);
            } else {
                for (let key in elements) {
                    if (elements[key].value !== undefined) {
                        elements[key].value = result[key] || '';
                    }
                }
                initializeFixedValues();
                updateSelectOptions(['roof_mat', 'roof_shape']);
                console.log("Data loaded successfully!");
                alert("Data loaded successfully!");
            }
        });
    }

    function getFormData() {
        const formData = {};
        for (let key in elements) {
            if (elements[key] && elements[key].value !== undefined) {
                formData[key] = elements[key].value.trim();
            }
        }
        console.log("Form data being sent:", formData);
        return {...formData, site: currentSite};
    }
});