function viewImages() {
    $('.fancybox').fancybox({
        thumbs: { "autoStart": true },
    });
}

function openModal(id) {
    $('#' + id).modal('show');
}

function showCollapse(id) {
    $('#' + id).collapse('show');
}
