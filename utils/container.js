module.exports = {

    unload: (container) => {
        var arr = [];
        for (let object of container.objects) {
            arr.push(object.item);
        }

        return arr;
    }
}