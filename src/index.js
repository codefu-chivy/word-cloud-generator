import Vue from "vue";
import vueResource from "vue-resource";

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
        generatedText: null,
        iterator: 0,
        rankedArr: []
    },
    methods: {
        generate: function() {
            var vm = this, rankObj = {}, textArr, size, pEl;
            this.filteredText = [];
            this.generatedText = null;
            this.rankedArr = [];
            if (this.text) {
                textArr = this.text.split(" ");
                this.fetchData(textArr, function() {
                    for (var i = 0; i < vm.filteredText.length; i++) {
                        if (vm.filteredText[i].length <= 2) {
                            continue;
                        }
                        var sameText = vm.filteredText.filter(function(ele) {
                            return ele === vm.filteredText[i];
                        });
                        if (sameText.length === 1) {
                            size = "twenty";
                        }
                        else if (sameText.length === 2) {
                            size = "twenty-five";
                        }
                        else if (sameText.length === 3) {
                            size = "thirty"
                        }
                        else if (sameText.length >= 4) {
                            size = "fourty";
                        }
                        vm.rankedArr.push({rank: sameText.length, name: vm.filteredText[i], size: size});
                    }
                    pEl = "<p>";
                    for (var j = 0; j < vm.rankedArr.length; j++) {
                        pEl += "<span id='" + vm.rankedArr[j].size + "'>" + vm.rankedArr[j].name + "</span>" + " ";
                    }
                    pEl += "</p>";
                    vm.generatedText = pEl;
                });
            }
        },
        fetchData: function(arr, callback) {
            var vm = this;
            var defArray = arr;
            if (vm.iterator > arr.length - 1) {
                vm.iterator = 0;
                callback();
                return;
            }
            vm.$http.get("https://wordsapiv1.p.mashape.com/words/" + defArray[vm.iterator], {
                headers: {
                    "X-Mashape-Authorization": "RlOyJsySqPmshT7Is7Oz3l2W0qe1p1REBMgjsn5J37VT7XDxKb"
                }
            }).then(function(res) {
                console.log(res)
                return res.json();
            }).then(function(json) {
                if (!json) {
                    vm.filteredText.push(json.word);
                    return;
                } 
                else if (!json.results) {
                    vm.iterator++;
                    vm.filteredText.push(json.word);
                    return vm.fetchData(defArray, callback);
                }
                if (json.results[0].partOfSpeech === "noun" || json.results[0].partOfSpeech === "verb" || json.results[0].partOfSpeech === "adjective") {
                    vm.filteredText.push(json.word);
                }
                vm.iterator++;
                vm.fetchData(defArray, callback);
            }).catch(function(err) {
                vm.iterator++;
                vm.fetchData(defArray, callback);
            });
        }
    }
});