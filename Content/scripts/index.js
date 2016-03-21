'use strict';
var pizzas;
var paginator;


$(document).ready(function ()
{
    if('serviceWorker' in navigator) 
        {
            navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(registration) 
                { 
                    console.log("Service Worker Registered"); 
                });      
             navigator.serviceWorker.ready.then(function(registration) 
                { 
                    console.log("Service Worker Ready");
                });
                
                navigator.serviceWorker.addEventListener('message', function(event) { 
                    var snackbarContainer = document.querySelector('#demo-snackbar-example');
                    var data = {
                                message: "Application ready to work offline",
                                timeout: 4000,
                                actionText: 'Undo'
                                };
                    if(snackbarContainer && snackbarContainer.MaterialSnackbar && snackbarContainer.MaterialSnackbar.showSnackbar)
                    {
                        snackbarContainer.MaterialSnackbar.showSnackbar(data);
                        }
                    console.log("message event");
                    });
          } 
    
    $("#serach-button").click(search);
    var url = "pizzas.json";
    $.getJSON(url, null, function (data) 
    {
        pizzas = data;
        $("#pagination").twbsPagination({
            totalPages: Math.round(data.length / 6.0 + 0.49),
            onPageClick: function (event, page) {
                $("#pizzas-container").empty();
                $("#pizzaTemplate").tmpl(data.slice(page * 6 - 6, page * 6 + 6 - 6)).appendTo("#pizzas-container");
                $('main').animate({ scrollTop: "0px" }, 'slow');
            }
        });
        $(".cssload-thecube").hide(400);
        $("#pizzas-container").show(700);
     });
});

function search()
{
    var result = [];
    var searchValue = $("#keywords").val();
    $.each(pizzas, function (index, value)
    {
        if (value.Name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 || value.Сomposition.toLowerCase().indexOf(searchValue.toLowerCase()) != -1)
        {
            result.push(value);
        }
    });

    $("#pagination").twbsPagination('destroy');
    $("#pagination").twbsPagination(
        {
            totalPages: Math.round(result.length / 6.0 + 0.49),
            onPageClick: function (event, page) {
                $("#pizzas-container").empty();
                $("#pizzaTemplate").tmpl(result.slice(page * 6 - 6, page * 6 + 6 - 6)).appendTo("#pizzas-container");
                $('main').animate({ scrollTop: "0px" }, 'slow');
            }
        });
}
