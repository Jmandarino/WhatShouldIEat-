//holds lattidute, longitute and address of your location
var lat = '';
var lng = '';


//used to make stars
$.fn.stars = function() {
    return $(this).each(function() {

        if($(this).hasClass("edited")){

        }else{
            $(this).html($('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
            $(this).addClass("edited");
        }

    });
};





//geocoder that makes use of lattitude and longitutde from navigator.geolocaiton
var geocoder = new google.maps.Geocoder();
window.onload = getLocation;

//price filter
//JQuery thread
$(document).ready(function () {
    $('#price-filter').multiselect();
    $('[data-toggle="popover"]').popover();
    makeStars();
});

function removeloader(){
    var item =  document.getElementById("loader");
    if (item.style.display == "none"){
        return;
    }else{
        item.style.display = "none"
    }
}

function makeStars(){
    $('span.stars').stars();
}

//div "serachOptions"
function addSearchOptions() {
    document.getElementById("searchOptions").style.visibility = "visible";

}


//automatically gets location
function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        //if user blocks location services.
        document.getElementById("warn").innerHTML = "<p> Location Services not turned on!</p> <p>Please search for zipcode</p>";
        document.getElementById("warn").className = "red";

    }
}

//print out position for debugging purposes
function showPosition(position) {
    document.getElementById("location").innerText = position.coords.latitude + " " + position.coords.longitude;
    //searches and outputs all the possible nearby places
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    outputResults(position.coords.latitude, position.coords.longitude);
}

//if the users wants to search by zip code
function zipToLocation() {
    var address = document.getElementById("zipcodebox").value;
    geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();

                //printed for debug purposes
                document.getElementById("location").innerText = lat + " " + lng;
                //searches and outputs all the possible nearby places
                outputResults(lat, lng);
            }

        }
    );

}

//when the users hits the apply function
function filtersearch(){

    //get location from
    getLocation();

    //prioritize zip code box
    if(document.getElementById("zipcodebox").value != ""){
        zipToLocation();
    }

    //output results is a function that searches google places api
   // outputResults(lat,lng);
}
//used to create requests
function create_request(location, radius, type) {
    //holds selected values
    var selectedValues = [];
    //min and max prices for searching
    var minprice;
    var maxprice;

    //this is the base request
    request = {
        location: location,
        radius: radius,
        type: type
    };

    //selected values from price dropdown
    $("#price-filter :selected").each(function () {
        selectedValues.push($(this).val());
    });


    if (selectedValues.length == 1) {
        minprice = selectedValues[0];
        maxprice = selectedValues[0];

        request["minPriceLevel"] = minprice;
        request["maxPriceLevel"] = maxprice;


    } else if (selectedValues.length > 1) {
        minprice = selectedValues[0];
        maxprice = selectedValues[selectedValues.length - 1];

        request["minPriceLevel"] = minprice;
        request["maxPriceLevel"] = maxprice;
    }

    //case insensitive of the first letters
    var re = /^[a-z]+$/i;
    var keyword = document.getElementById("keywordsearchfield");

    if (keyword != null && keyword.value != '') {

        //strip white space
        keyword = $.trim(keyword.value);

        // keyword = (keyword).match(re)[0];

        if (re.test(keyword)) {

            request["keyword"] = keyword.match(re);
        }


    }

    //request["openNow"] = $("#opennow").hasClass("active")


    return request;
}

//holds old html information
var data;
//flag set to show if data is being appended or not
var append = false;

//takes care searching for the
function outputResults(lat, lng) {
// what is 500
//what should type be
//     var request = {
//         location: new google.maps.LatLng(lat, lng),
//         radius: '750', // in meters
//         type: 'restaurant' // can only search for one type
//
//     };

    request = create_request(new google.maps.LatLng(lat, lng), '750', 'restaurant');

    /* DATA RESET */
    var container = document.getElementById('results');
    document.getElementById('results2').innerHTML = "";

    // if we reset the search we aren't appending anymore.
    var append = false;
    // clean out old results if there are any.
    container.innerHTML = "";
    //reset data, there is no old html code that should be stored.
    data = "";

    /* USE OF GOOGLE PLACES API */
    var service = new google.maps.places.PlacesService(container);
    service.nearbySearch(request, callback);

    function callback(results, status, pagination) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

            //remove the load button
            try{
                document.getElementById("load-button").remove();
            } catch (e){
                // TODO: program properly
                //squelshing error which is bad programming practice
                //console.log(e);
            }

            //random result:
            var item = results[Math.floor(Math.random() * results.length)];

            console.log(results.length);

            //if we are appending we arne't selecting a new winner.
            if (!append) {
                var winner = '';
                winner += '<h2>Winner!!</h2>';

                winner += '<p>';

                if ("photos" in item) {
                    winner += '<img class="img-fluid" src="' + item.photos[0].getUrl({
                            'maxWidth': 100,
                            'maxHeight': 100
                        }) + '">'
                } else {
                    winner += '<img class="img-fluid" src="assets/images/no_image.gif">';
                }

                winner += item.name + '<br />';
                winner += item.vicinity + '<br />';
                winner += '<span class="stars">'+item.rating+'</span>' + '<br />';
                winner += '</p><hr>';

                //remove loader
                removeloader()
                //reset the winner's html
                document.getElementById('winner').innerHTML = winner;

            }
            var html = '';
            for (var i = 0; i < results.length; i++) {

                /* wrapper */

                if (i % 2 == 0) {
                    html += '<div class="row">'
                }

                //themeing with divs
                html += '<div class="restaurants">';
                html += '<div class="col-lg-6 col-md-6 offset-md-0 col-sm-6 offset-sm-0 col-xs-6 offset-xs-3 item">';
                html += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';


                //some restaurant don't have photos
                if (results[i].hasOwnProperty("photos")) {
                    html += '<img class="img-fluid" src="' + results[i].photos[0].getUrl({
                            'maxWidth': 300,
                            'maxHeight': 200
                        }) + '">'
                } else {
                    html += '<img class="img-fluid" src="assets/images/no_image.gif">'
                }
                html += '</div>';
                html += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';


                html += '<div class="title"><h4>' + results[i].name + '</h4></div>';

                html += '<p class="description">';
                html += results[i].vicinity + '<br />';

                if (results[i].hasOwnProperty("rating")) {
                    html += '<span class="stars">'+results[i].rating +'</span>' + '<br />';
                } else {
                    html += 'Not rated' + '<br />';
                }

                /* end of wrapper */
                html += '</p>';
                html += '</div>';
                html += '</div>';
                html += '</div>';//close restaurants class

                if (i % 2 != 0) {
                    html += '</div>'
                }
            }
            html += '</div>';

            //make stars
            makeStars();

            if (pagination.hasNextPage) {
                html += '<div class="row"><div class="text-center col-md-12 col-lg-12 col-sm-12"><button id="load-button" type="button" class="btn btn-primary load-button" >Load More</button></div></div>';
            }
            if (append) {
                var div = document.getElementById("results");

                div.innerHTML = data;

                //remove old button
                document.getElementById("load-button").remove();
                //reset the old data to include the removed load more button
                data = div.innerHTML;

                //add new html to old html
                div.insertAdjacentHTML('beforeend', html);

                //the saved old html, append new html to be saved for later.
                data += html;
                makeStars();


            } else {
                document.getElementById("results").innerHTML = html;
                append = true;
                data = html;
            }


            //if there are more pages
            if (pagination.hasNextPage) {
                //we are appending
                append = true;

                //remove the load button


                //creating a button adding an event listener
                var button = document.getElementById("load-button");
                button.disabled = false;

                makeStars();

                button.addEventListener('click', function () {

                    //on click we will go to the next page of the API results
                    //this calls the callback function again.
                    button.disabled = true;
                    append = true;
                    pagination.nextPage();

                });


            } else {
                //hide the home button
                makeStars();
                try {
                    document.getElementById("load-button").style.visibility = "hidden";
                } catch (e) {
                    console.log("no load button");
                }
            }
        }
    }
}
