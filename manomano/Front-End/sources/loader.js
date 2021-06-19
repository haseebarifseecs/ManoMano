document.querySelector("#refreshBtn").addEventListener("click",function(event){
    event.preventDefault();
    console.log("clicked");
    $("#dataloader").css("display", "block");
    fetch('https://manomano-scraper.herokuapp.com/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(res){
                res.json().then(
                    function(result){
                        console.log(result);
                        let t = $('#example').DataTable();
                        t.clear().draw();
                        result.forEach((el) => {

                            t.row.add([
                                el.idme,
                                el.name,
                                el.keyword,
                                el.source,
                                el.rank,
                                el.pageUrl,
                                el.category,
                                new Date(el.date).toLocaleDateString()
                            ]).draw(false);
                        
                    }
                );
                $("#dataloader").css("display", "none");
            })
    })
})


document.querySelector("#uploadBtn").addEventListener("click",
function fileHandler(event) {
    event.preventDefault();
    console.log("clicked");
    $("#dataloader").css("display", "block");
    if (!$("#csvFileInput").val()) {
        $("#dataloader").css("display", "none");
        Swal.fire({
            icon: 'error',
            title: "ERROR",
            html: 'Please Select a CSV file first',
        }).then(() => {})
    } else {
        var input = document.querySelector('input[type="file"]')
        var data = new FormData()
        data.append('uploadfile', input.files[0])
        data.append("Content-Type", "application/octet-stream");
        fetch('https://manomano-scraper.herokuapp.com/upload', {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
            }
        }).then(function(res) {
            $("#fileloader").css("display", "none")
            if (!res.ok) {
                res.text().then(text => {
                    Swal.fire({
                        icon: 'error',
                        title: "UPLOAD FAILED",
                        html: text,
                    })
                })
            } else {
                document.getElementById("uploadBtn").disabled = true;
                $("#dataloader").css("display", "none");
                Swal.fire({
                    icon: 'success',
                    title: "UPLOADED",
                    // html: text,
                }).then(() => {
                    $("#csvFileInput").val(null);
                    document.getElementById("uploadBtn").disabled = false;
                })
            }

        }).catch(function(e) {
            $("#dataloader").css("display", "none");
            Swal.fire({
                icon: 'error',
                title: "UPLOAD FAILED",
                html: e,
            })
        })
    }


})
// async function dataLoader() {
//     const xhr = new XMLHttpRequest();
//     xhr.responseType = 'json';
//     xhr.onload = function() {
//         const tableBody = $("#table-body");
//         tableBody.empty();
//         const result = this.response;
//         $(document).ready(function() {
//             let t = $('#example').DataTable();
//             result.forEach((el) => {

//                 t.row.add([
//                     el.idme,
//                     el.name,
//                     el.keyword,
//                     el.source,
//                     el.rank,
//                     el.pageUrl,
//                     el.category,
//                     new Date(el.date).toLocaleDateString()
//                 ]).draw(false);
//                 // console.log([
//                 //     el.idme,
//                 //     el.name,
//                 //     el.keyword,
//                 //     el.source,
//                 //     el.rank,
//                 //     el.pageUrl,
//                 //     el.url,
//                 //     el.date
//                 // ])
//             })
//         })



//     }
//     xhr.open("GET", `https://manomano-fuxtec.herokuapp.com`);
//     xhr.setRequestHeader("Content-type", "x-www-form-urlencoded");
//     xhr.send();

// }
// window.onload = 
//     function loadyload(){
//         dataLoader();
//     };
    



