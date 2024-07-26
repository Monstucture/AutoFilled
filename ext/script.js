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

		payplan: document.getElementById('payplan'),
		payor: document.getElementById('payor'),
		housesize: document.getElementById('housesize'),
		personal_statues: document.getElementById('personal_statues'),
		Inspermission: document.getElementById('Inspermission'),
		Ins_score: document.getElementById('Ins_score'),
		heater_location: document.getElementById('heater_location'),
		resident_type: document.getElementById('resident_type'),
		usage: document.getElementById('usage'),
		water_year: document.getElementById('water_year'),
		option1: document.getElementById('option1'),
		option2: document.getElementById('option2'),
		waterCov: document.getElementById('waterCov'),
    };

    const fixedValues = {
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
    };

    if (!validateElements(elements)) return;

    initializeFixedValues();
    setupEventListeners();

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
        for (let key in fixedValues) {
            elements[key].value = fixedValues[key];
        }
    }

    function setupEventListeners() {
        elements.autofill.addEventListener("click", handleAutofill);
        elements.resetFields.addEventListener("click", handleReset);
        elements.save.addEventListener("click", handleSave);
        elements.load.addEventListener("click", handleLoad);
    }

    function handleAutofill() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			const formData = getFormData();
			console.log("Sending form data:", formData);
			chrome.tabs.sendMessage(tabs[0].id, formData, function(response) {
				if (chrome.runtime.lastError) {
					console.error('Error in autofill:', chrome.runtime.lastError);
				} else if (response && response.status === "Success") {
					console.log("Autofill successful");
				} else {
					console.error('Error in autofill:', response);
				}
			});
		});
	}
	

    function handleReset() {
        for (let key in elements) {
            if (elements[key].value !== undefined && !fixedValues.hasOwnProperty(key)) {
                elements[key].value = '';
            }
        }
        initializeFixedValues();
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
                console.log("Data loaded successfully!");
                alert("Data loaded successfully!");
            }
        });
    }

    function getFormData() {
		const formData = {};
		for (let key in elements) {
			if (elements[key].value !== undefined) {
				formData[key] = elements[key].value;
				console.log(`${key}: ${formData[key]}`);
			}
		}
		return {...formData, ...fixedValues};
	}
});