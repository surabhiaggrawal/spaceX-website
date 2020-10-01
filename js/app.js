
window.onload = function(){
    loadCardDetails(false);
}


var loadCardDetails = function(reload) {
    $('.lds-spinner').css('display','inline-block');
    $('.cards-container').css('display','none');

    $.ajax({
        type: "GET",
        url: 'https://api.spaceXdata.com/v3/launches?limit=100',
        dataType: "json",
        success: function (data) {
            if (data != null || data != undefined) {
                renderCardDetails(data,reload);
                trackRadioSelection();                
            } else {
                console.log('There was issue in fetching details');
            }

        },
        error: function (error) {
            $('.lds-spinner').css('display','none');
            $('.cards-container').css('display','flex');
            console.log(error);
        }
    });
}


var renderCardDetails = function (data,renderCount) {

    let htm;
    if(renderCount){
        htm = '';
    } else{
        htm = $('.cards-container').html();
    }

    if(data == null || data.length == 0){

        $('.lds-spinner').css('display','none');
        $('.cards-container').css('display','flex');

        let noResultsDiv = '<div class="noResults">No Matching Results for Selected filter</div>';
        htm = $('.cards-container').html(noResultsDiv);

    } else{
        data.forEach(element => {
            //making list of mission Id's and storing in list variable
            let list = '';
            let missionIds = [];
            missionIds = element.mission_id;
            if(missionIds !== null){
                list = '<ul class="missionidlist">';
               for( i= 0; i < missionIds.length ; i++){
                    list += '<li class="missionidlistItem">'+missionIds[i]+'</li>';
               }
               list += '</ul>'
            } else{
                list = '';
            }
    
            //Creating Cards for display
            let card =  
            `<div class="card-tile">
            <div class="card-img">
                <img class="mission-spacecraft-img"
                srcset="${element.links.mission_patch_small} 480w,
                        ${element.links.mission_patch} 800w"
                sizes="(max-width: 1023px) 480px,
                    800px"
                src="${element.links.mission_patch}" alt="Mission_image">
            </div>
            <div class="card-heading">
                <span class="mission-name mission-id">${element.mission_name}</span>
                <span class="flight-number mission-id"># ${element.flight_number}</span>
            </div>
            <div class="card-details">
                <div class="mission-ids card-sec">
                    <span class="mission-label">Mission Ids:</span>
                    
                    <span class="mission-details">`+list+`</span>
                </div>
                <div class="launch-year-card card-sec">
                    <span class="mission-label">Launch Year:</span>
                    <span class="mission-details">${element.launch_year}</span>
                </div>
                <div class="success-launch-card card-sec">
                    <span class="mission-label">Successful Launch:</span>
                    <span class="mission-details">${element.launch_success}</span>
                </div>
                <div class="success-landing-card card-sec">
                    <span class="mission-label">Successful Landings:</span>
                    <span class="mission-details">${element.is_tentative}</span>
                </div>
            </div>
            </div>`

            htm += card;   
        });
        $('.lds-spinner').css('display','none');
        $('.cards-container').css('display','flex');
        $('.cards-container').html(htm);
    }

    
}

var collectFilterData = function() {
    let launchYr = 0;
    let successfulLaunch = undefined;
    let successfulLand = undefined;

    if($('input[name=launch-yr-btn]:checked').length > 0){
        launchYr = $('input[name=launch-yr-btn]:checked').val().toLowerCase();
        console.log('yes selected' + launchYr);
    }
    if($('input[name=success-launch-btn]:checked').length > 0){
        successfulLaunch = $('input[name=success-launch-btn]:checked').val().toLowerCase();
        console.log('yes selected' + successfulLaunch);
    }
    if($('input[name=success-land-btn]:checked').length > 0){
        successfulLand = $('input[name=success-land-btn]:checked').val().toLowerCase();
        console.log('yes selected' + successfulLand);
    } 
    
    callApi(launchYr,successfulLaunch,successfulLand);
}

var callApi = function(year,launch,land){

    let dynamicUrl;

    $('.lds-spinner').css('display','inline-block');
    $('.cards-container').css('display','none');

    if(year && launch && land) {
        dynamicUrl = 'https://api.spacexdata.com/v3/launches?limit=100&launch_success='+launch+'&land_success='+land+'&launch_year='+year; 
    }else if(launch && land) {
        dynamicUrl = 'https://api.spaceXdata.com/v3/launches?limit=100&launch_success='+launch+'&land_success='+land;
    }else if(launch) {
        dynamicUrl = 'https://api.spaceXdata.com/v3/launches?limit=100&launch_success='+launch;
    }

    if(dynamicUrl !== undefined){
        $.ajax({
            type: "GET",
            url: dynamicUrl,
            dataType: "json",
            success: function (data) {
                if (data != null || data != undefined) {
                    let rerender = true;
                    renderCardDetails(data,rerender);
                    trackRadioSelection();                
                } else {
                    console.log('There was issue in fetching details');
                }
    
            },
            error: function (error) {
                console.log(error);
                $('.lds-spinner').css('display','none');
                $('.cards-container').css('display','flex');
            }
        });
    } else{
        $('.lds-spinner').css('display','none');
        $('.cards-container').css('display','flex');
    }
}

var trackRadioSelection = function(){
    
    $('input[name=success-launch-btn][value=False]').click(function(){
        $('input[type="radio"][name=success-land-btn]').attr('disabled',true);
        $('input[name=success-land-btn]').prop("checked", false);
        $('label[for=True-land],label[for=False-land]').css("opacity", 0.5);

    });

    $('input[name=success-launch-btn][value=True]').click(function(){
        $('input[type="radio"][name=success-land-btn]').attr('disabled',false);
        $('label[for=True-land],label[for=False-land]').css("opacity", 1);
    });

    $('input[type="radio"][name=launch-yr-btn],input[type="radio"][name=success-launch-btn],input[type="radio"][name=success-land-btn]').click(function(){
       betterFunction();
      });

      $('.spaceX-button').click(function(){
        $('input[name=success-launch-btn]').prop("checked", false); 
        $('input[name=launch-yr-btn]').prop("checked", false); 
        $('input[name=success-land-btn]').prop("checked", false); 
        $('label[for=True-land],label[for=False-land]').css("opacity", 1);
        $('input[type="radio"][name=success-land-btn]').attr('disabled',false);
        loadCardDetails(true);
      });
}


const delayedSearch = function (fn, delay) {
    let timer;
    return function() {
        let context = this,
            args = arguments;

        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay)
    }
}
const betterFunction = delayedSearch(collectFilterData, 1000);