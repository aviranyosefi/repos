
function DateToString(date) {

    var date = format.format({
        value: date,
        type: format.Type.DATE
    });

    return date

}

function StringToDate(date) {

    var date = format.parse({
        value: date,
        type: format.Type.DATE
    });

    return date

}