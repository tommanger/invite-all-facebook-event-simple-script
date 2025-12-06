(function() {
    alert("לחץ עכשיו על האלמנט שממנו תרצה להוציא את ה-URL");

    function activatePicker() {
        document.body.style.cursor = "crosshair";

        function mouseOver(e) {
            e.target.style.outline = "2px solid red";
        }

        function mouseOut(e) {
            e.target.style.outline = "";
        }

        function clickHandler(e) {
            e.preventDefault();
            e.stopPropagation();

            // האלמנט שנבחר
            const selected = e.target;

            // ניקוי האירועים
            document.body.style.cursor = "";
            document.removeEventListener("mouseover", mouseOver);
            document.removeEventListener("mouseout", mouseOut);
            document.removeEventListener("click", clickHandler, true);

            const bg = window.getComputedStyle(selected).getPropertyValue('background-image');
            alert("האלמנט שנבחר:\n" + selected.tagName + "\n\nBackground image:\n" + bg);

            // חיפוש כל האלמנטים עם אותו ה־background-image
            const all = document.querySelectorAll("*");

            all.forEach(el => {
                const style = window.getComputedStyle(el);
                const img = style.getPropertyValue('background-image');
                if (img === bg) {
                    console.log("Found match:", el);
                    el.click();
                }
            });

            alert("בוצע! כל האלמנטים עם אותו background-image נלחצו");
        }

        document.addEventListener("mouseover", mouseOver);
        document.addEventListener("mouseout", mouseOut);
        document.addEventListener("click", clickHandler, true);
    }

    activatePicker();
})();
