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
        var ring = $("<img>").addClass("fa-spin").attr("src", "http://clipart-library.com/images_k/transparent-gears/transparent-gears-8.png");
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
