var pizzas;

$(document).ready(function ()
{
    $("#serach-button").click(search);
    var url = "pizzas.json";
    $.getJSON(url, null, function (data) 
    {
        //pizzas = data;
        pizzas = $("#pizzaTemplate").tmpl(data).load(function(){

        $("#pagination").twbsPagination({
            totalPages: Math.round(data.length / 6.0 + 0.49),
            onPageClick: function (event, page) {
                $("#pizzas-container").empty();
                //$("#pizzaTemplate").tmpl(data.slice(page * 6 - 6, page * 6 + 6 - 6)).appendTo("#pizzas-container");
                pizzas.slice(page * 6 - 6, page * 6 + 6 - 6).appendTo("#pizzas-container");
                $('main').animate({ scrollTop: "0px" }, 'slow');
            }
        });
        $(".cssload-thecube").hide(400);
        $("#pizzas-container").show(700);
        });
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
