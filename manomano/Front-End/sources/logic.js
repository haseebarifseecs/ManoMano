// async function reqHandler(idme){
//     const xhr = new XMLHttpRequest();
//     xhr.responseType = 'json';
//     xhr.onload = function(){
//         const tableBody = document.querySelector("#table-body");
//         const result = this.response;
//         $(document).ready(function(){
//         let t = $('#example').DataTable();
//         result.forEach( (el) => {

//         t.row.add([
//             el.idme,
//             el.name,
//             el.keyword,
//             el.source,
//             el.rank,
//             el.pageUrl,
//             el.url,
//             el.date
//         ]).draw( false );
//         console.log([
//             el.idme,
//             el.name,
//             el.keyword,
//             el.source,
//             el.rank,
//             el.pageUrl,
//             el.url,
//             el.date
//         ])
//     })
//         })



//     }
//     xhr.open("GET",`http://localhost:4444/${idme}`);
//     xhr.setRequestHeader("Content-type","x-www-form-urlencoded");
//     xhr.send();

// }


async function formHandler(event) {
    event.preventDefault();
    const idme = document.querySelector("#idme").value;
    const keyword = document.querySelector("#keyword").value;
    const select = document.querySelector("#selector").value;
    const Data = {
        idme: idme,
        keyword: keyword,
        source: select
    }
    // $.ajax
    // ({
    //     url:"http://localhost:4444/scrape",
    //     type:'POST',
    //     cors:true,
    // headers:{
    //     'Content-Type':"x-www-form-urlencoded",
    //     'Access-Control-Allow-Origin': '*',
    // },
    //     data:,
    //     success:function(d){
    //         // $("body").html(data) ;
    //         alert(d);
    //         console.log(typeof(data));
    //     }
    // });  

    $.post("https://manomano-fuxtec.herokuapp.com/scrape",
        Data,
        function(d, status) {
            if (status !== 200) {
                swal({
                    title: "TimeOut!",
                    text: "Manomano TimedOut 500 Status Try Again after sometime!",
                    icon: "error",
                    button: "OK",
                })
            }
            if (d.status === 200) {
                swal({
                    title: "Success!",
                    text: "Data Scraped Successfully!",
                    icon: "success",
                    button: "OK",
                });
                let t = $('#example').DataTable();
                t.row.add([
                    d.idme,
                    d.name,
                    d.keyword,
                    d.source,
                    d.rank,
                    d.pageUrl,
                    d.category,
                    new Date(d.date).toLocaleDateString()
                ]).draw(false);
                //   $("#table-body").empty();
                //   dataLoader();
            } else if (d.status === 500) {
                swal({
                    title: "TimeOut!",
                    text: "Manomano TimedOut 500 Status Try Again after sometime!",
                    icon: "error",
                    button: "OK",
                });
            };
        }).fail(function(error) {

        swal({
            title: "TimeOut!",
            text: "Manomano TimedOut 500 Status Try Again after sometime!",
            icon: "error",
            button: "OK",
        });
    })
    // await reqHandler(idme);
}



// // Initiate an Ajax request on button click
// $(document).on("click", "button", function(){
//     // Adding timestamp to set cache false

// });

// Add remove loading class on body element depending on Ajax request status
// $(document).on({
//     ajaxStart: function() {
//         $("body").addClass("loading");
//     },
//     ajaxStop: function() {
//         $("body").removeClass("loading");
//     }
// });