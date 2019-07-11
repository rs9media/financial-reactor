//Ring
var Ring = function(configuration) {
    //Internal Reference
    var self = this;
    //Label
    self.label = "";
    //Inputs
    self.generators = [];
    //Outputs
    self.loads = [];
    //Frequency
    self.frequency = 0;    
    //Generator Sum
    self.generatorSum = 0;
    //Input Requirement
    self.generatorRequirement = 0;
    //Constructor
    self.constructor = function() {
        self.label = configuration.label;        
        self.generators = configuration.generators;
        self.loads = configuration.loads;
        setInterval(self.loop, 3000);
    };
    //Loop
    self.loop = function() {
        //Calculate Frequency
        self.calculateGeneratorSum();
        //Generator Requirements
        self.calculateGeneratorRequirements();
        //Calculate Frequency
        self.calculateFrequency();
        
        //Log Data
        console.log(self.label,{
            "frequency":self.frequency,
            "generatorSum":self.generatorSum,
            "generatorRequirement":self.generatorRequirement
        });
        
        //Fault Warning
        if(self.generatorSum < self.generatorRequirement){
            throw {
                "instance":self.label,
                "name" : "LOW_GENERATOR_CURRENT",
                "message" : "Financial current is too low to spin this Ring"
            };
        }
    }; 
    //Add Load
    self.addLoad = function(additionalLoad){
        console.log(self.label + " add load",additionalLoad);
        self.loads.push(additionalLoad);
    };
    //Add Generator
    self.addGenerator = function(additionalGenerator){
        self.generators.push(additionalGenerator);
    };
    //Calculate Frequency
    self.calculateFrequency = function(){
        //Frequency
        if(self.generatorRequirement > 0){
            self.frequency = (self.generatorSum / self.generatorRequirement);
        }
        else{            
            self.frequency = 0;        
        }        
        //Send it back
        return self.frequency;
    };
    //Calculate Generator Sum
    self.calculateGeneratorSum = function(){
        //Generator Sum
        self.generatorSum = 0;    
        //Loop through generators
        for(i in self.generators){
            //Current Generator Object
            var currentGeneratorObject = self.generators[i];
            //Increment generatorSum
            self.generatorSum += currentGeneratorObject.amount;
        }
        //Send it back
        return self.generatorSum;
    };
    //Calculate Input Requirements
    self.calculateGeneratorRequirements = function(){
        //Input Requirement
        self.generatorRequirement = 0;    
        //Loop through loads
        for(i in self.loads){
            //Current Output
            var currentOutputObject = self.loads[i];
            //Increment input requirement
            self.generatorRequirement += currentOutputObject.amount;
        }
        //Send it back
        return self.generatorRequirement;
    };
    //Calculate Surplus Current
    self.calculateSurplusCurrent = function(){
        return (self.calculateGeneratorSum() - self.calculateGeneratorRequirements());
    }
    //Showtime
    self.constructor();
};
//Input
var FinancialCurrentGenerator = function(configuration) {
    //Internal Reference
    var self = this;
    //Label
    self.label = null;
    //Amount
    self.amount = null;
    //Constructor
    self.constructor = function() {
        self.label = configuration.label;
        self.amount = configuration.amount;
    };
    //Showtime
    self.constructor();
};
//Output
var FinancialCurrentLoad = function(configuration) {
    //Internal Reference
    var self = this;
    //Label
    self.label = null;
    //Amount
    self.amount = null;
    //Constructor
    self.constructor = function() {
        self.label = configuration.label;
        self.amount = configuration.amount;
    };
    //Showtime
    self.constructor();
};
//Financial Reactor
var FinancialReactor = function() {
    //Internal Reference
    var self = this;
    //Rings
    self.rings = {};
    //Constructor
    self.constructor = function() {
        //Rings
        self.rings = {
            "L1": new Ring({
                "label":"L1",
                "generators": [
                    new FinancialCurrentGenerator({
                        "label": "Uber Eats",
                        "amount": 30
                    })
                ],
                "loads": [
                    new FinancialCurrentLoad({
                        "label": "Operator",
                        "amount": 7
                    }),
                    new FinancialCurrentLoad({
                        "label": "GBV/ARES-5",
                        "amount": 7
                    }),
                    new FinancialCurrentLoad({
                        "label": "GBV/ARES-5 Insurance",
                        "amount": 2.41
                    }),
                    new FinancialCurrentLoad({
                        "label": "Comm Package",
                        "amount": 1.61
                    })
                ]
            }),
            "L2": new Ring({
                "label":"L2",                
                "generators": [
                    new FinancialCurrentGenerator({
                        "label": "Type-W Development Contracts",
                        "amount": 0
                    }),
                    new FinancialCurrentGenerator({
                        "label": "Type-W Maintenance Contracts",
                        "amount": 2
                    })       
                ],
                "loads": [
                    new FinancialCurrentLoad({
                        "label": "L1 Ring",
                        "amount": 30
                    }),
                    new FinancialCurrentLoad({
                        "label": "Operator",
                        "amount": 7
                    }),                    
                    new FinancialCurrentLoad({
                        "label": "MWS/FA-300",
                        "amount": 20
                    })
                ]
            }),
            "L3": new Ring({
                "label":"L3",                
                "generators": [
                    new FinancialCurrentGenerator({
                        "label": "Type-W Development Contracts",
                        "amount": 0
                    }),
                    new FinancialCurrentGenerator({
                        "label": "Type-W Maintenance Contracts",
                        "amount": 0
                    }),
                    new FinancialCurrentGenerator({
                        "label": "Type-R Sales Profits",
                        "amount": 0
                    }),
                    new FinancialCurrentGenerator({
                        "label": "Type-P Subscriptions",
                        "amount": 0
                    })      
                ],
                "loads": [
                    new FinancialCurrentLoad({
                        "label": "L2 Ring",
                        "amount": 80
                    }),
                    new FinancialCurrentLoad({
                        "label": "Operator",
                        "amount": 7
                    }),                    
                    new FinancialCurrentLoad({
                        "label": "MWS/FA-300",
                        "amount": 20
                    }),
                    new FinancialCurrentLoad({
                        "label": "Data / Engineer / Artisan  Staff",
                        "amount": 13
                    })
                ]
            })          
        };
        //Loop through each ring...
        for(identifier in self.rings){
            //Calculate Surplus Current
            var currentRingSurplusCurrent = self.rings[identifier].calculateSurplusCurrent();
            //Lel
            console.log(self.rings[identifier].label + " LEL SURPLUS",currentRingSurplusCurrent);
            //If there is a surplus, harvest the current
            if(currentRingSurplusCurrent > 0){
                self.rings[identifier].addLoad(
                    new FinancialCurrentLoad({
                        "label": "Warchest",
                        "amount": currentRingSurplusCurrent
                    })
                );
            }    
        }
        
        
    }
    //Showtime
    self.constructor();
};

new FinancialReactor();
