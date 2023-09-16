
// function printHello() {
//     console.log("Hello");
// }

function saveDataInDatabase(anything) {

    console.log("Data is saving...");
    console.log("Data saved...");
    console.log("hurrayy!");
    // return
    console.log("Vapas Chalo");

    anything();
}

saveDataInDatabase(function () {
    console.log("Data saved");
    printHello(() => {
        
    });
});


function printHello() {
    console.log("Hello");
}