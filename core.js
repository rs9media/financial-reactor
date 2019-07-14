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
    //Avatar
    self.avatar = null;
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
        self.avatar = self.renderRing();
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
        console.log(self.label, {
            "frequency": self.frequency,
            "generatorSum": self.generatorSum,
            "generatorRequirement": self.generatorRequirement
        });
        //Set Ring Spin
        self.setRingSpin(self.frequency);
        //Fault Warning
        if (self.generatorSum < self.generatorRequirement) {
            throw {
                "instance": self.label,
                "name": "LOW_GENERATOR_CURRENT",
                "message": "Financial current is too low to spin this Ring"
            };
        }
    };
    //Render Ring
    self.renderRing = function() {
        //Ring
        var ring = $("<img>").addClass("fa-spin").attr("src", "data:image/png;base64,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");        
        //Add ID
        $(ring).attr("identifier", self.label);
        //Calcualate Size	  
        $(ring).width((180 + (8 * self.loads.length)) + "px");
        //Add to #stage
        $("#stage").append(ring);
        //Break;
        $("#stage").append("</br>");
        //Show what's in it
        $("#stage").append(
            $("<span>").text(self.renderLoadList())
        );
        //Break;
        $("#stage").append("</br>");				
        //Return a handle
        return ring;
    };
    //Render Load List
    self.renderLoadList = function(){
        //Load List
        var loadList = [];
        //Loop through loads
        for (i in self.loads) {
            //Current Output
            var currentLoad = self.loads[i];
            //Add to list
            loadList.push(currentLoad.label);
        }	
        //Join and send back
        return loadList.join(" :: ");
    };
    //Set Ring Spin
    self.setRingSpin = function(spin) {
        //Rate
        var rate = null;
        //If we have a value, use it
        if(spin > 0){
            rate = (1 / spin);
        }
        else{
            rate = 0;
        }
        //Spin Label
        $(self.avatar).attr("spinRate", spin);
        $(self.avatar).css("animation", "fa-spin " + rate + "s infinite linear");
    };
    //Add Load
    self.addLoad = function(additionalLoad) {
        console.log(self.label + " add load", additionalLoad);
        self.loads.push(additionalLoad);
    };
    //Add Generator
    self.addGenerator = function(additionalGenerator) {
        self.generators.push(additionalGenerator);
    };
    //Calculate Frequency
    self.calculateFrequency = function() {
        //Frequency
        if (self.generatorRequirement > 0) {
            self.frequency = (self.generatorSum / self.generatorRequirement);
        } else {
            self.frequency = 0;
        }
        //Send it back
        return self.frequency;
    };
    //Calculate Generator Sum
    self.calculateGeneratorSum = function() {
        //Generator Sum
        self.generatorSum = 0;
        //Loop through generators
        for (i in self.generators) {
            //Current Generator Object
            var currentGeneratorObject = self.generators[i];
            //Increment generatorSum
            self.generatorSum += currentGeneratorObject.amount;
        }
        //Send it back
        return self.generatorSum;
    };
    //Calculate Input Requirements
    self.calculateGeneratorRequirements = function() {
        //Input Requirement
        self.generatorRequirement = 0;
        //Loop through loads
        for (i in self.loads) {
            //Current Output
            var currentOutputObject = self.loads[i];
            //Increment input requirement
            self.generatorRequirement += currentOutputObject.amount;
        }
        //Send it back
        return self.generatorRequirement;
    };
    //Calculate Surplus Current
    self.calculateSurplusCurrent = function() {
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
var FinancialReactor = function(rings) {
    //Internal Reference
    var self = this;
    //Rings
    self.rings = {};
    //Constructor
    self.constructor = function() {
        //Rings
        self.rings = rings;
        //Loop through each ring...
        for (identifier in self.rings) {
            //Calculate Surplus Current
            var currentRingSurplusCurrent = self.rings[identifier].calculateSurplusCurrent();
            //Lel
            console.log(self.rings[identifier].label + " LEL SURPLUS", currentRingSurplusCurrent);
            //If there is a surplus, harvest the current
            if (currentRingSurplusCurrent > 0) {
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
