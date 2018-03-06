$( 'input#key-1' ).add( 'input#key-2' ).on("change", function(){
    var key1 = $( 'input#key-1' ).val(),
        key2 = $( 'input#key-2' ).val();

    if ( key1 !== key2 ) {
        $( 'input#btn-save' ).addClass("disabled");
        $( 'span#pass-warning' ).text("Passwords are not matching together!").removeClass("hidden");
        $( 'input#key-1' ).add( 'input#key-2' ).css({"border-color": "red", 
                                                     "border-width":"1px", 
                                                     "border-style":"solid"});

    } else {
        $( 'input#btn-save' ).removeClass("disabled");
        $( 'span#pass-warning' ).val("").addClass("hidden");
        $( 'input#key-1' ).add( 'input#key-2' ).css({"border-color": "#ccc", 
                                                     "border-width":"1px", 
                                                     "border-style":"solid"});
        
        if (key1.length < 5) {
            $( 'input#btn-save' ).addClass("disabled");
            $( 'span#pass-alert' ).text("Password must be at least 5 digits long!").removeClass("hidden");
        } else {
            $( 'span#pass-alert' ).text("").addClass("hidden");
        }
    }
});