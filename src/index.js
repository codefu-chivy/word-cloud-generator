import Vue from "vue";
import vueResource from "vue-resource";
import commonWords from "./commonWords";

Vue.use(vueResource);

new Vue({
    http: {
        root: '/root',
        headers: {
            Authorization: 'Basic YXBpOnBhc3N3b3Jk'
        }
    },
    el: "#app",
    data: {
        text: "",
        filteredText: [],
        generatedText: 0,
        iterator: 0,
        rankedArr: [],
        showLoader: false
    },
    methods: {
        generate: function() {
            var vm = this, rankObj = {}, textArr, size, pEl;
            this.filteredText = [];
            this.generatedText = null;
            this.rankedArr = [];
            if (this.text) {
                this.showLoader = true;
                textArr = this.text.replace(/[!@#$%^&*?,.:;<>(){}'/]/g, "").replace(/-/g, " ").toLowerCase();
                textArr = textArr.split(" ");
                this.filteredText = textArr.filter(function(ele) {
                    return commonWords.indexOf(ele) === -1;
                }).sort();
                if (!this.filteredText.length) {
                    return;
                }
                for (var i = 0; i < this.filteredText.length; i++) {
                    var sameText = this.filteredText.filter(function(ele) {
                        return ele === vm.filteredText[i] || ele.indexOf(vm.filteredText[i]) !== -1;
                    });
                    if (sameText.length === 1) {
                        size = "twenty";
                    }
                    else if (sameText.length === 2) {
                        size = "thirty-five";
                    }
                    else if (sameText.length === 3) {
                        size = "fifty-five"
                    }
                    else if (sameText.length >= 4) {
                        size = "seventy";
                    }
                    this.rankedArr.push({rank: sameText.length, name: this.filteredText[i], size: size});
                    this.filteredText = this.filteredText.filter(function(ele) {
                        return ele !== vm.filteredText[i];
                    });
                    i = -1;
                }
                pEl = "<p>";
                for (var j = 0; j < this.rankedArr.length; j++) {
                    pEl += "<span id='" + this.rankedArr[j].size + "'>" + this.rankedArr[j].name + "</span>" + " ";
                }
                pEl += "</p>";
                this.showLoader = false;
                this.generatedText = pEl;
            }
        }
    }
});