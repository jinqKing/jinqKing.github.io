document.addEventListener('DOMContentLoaded', function () {

    // 脚注预览，需要配合 css 的
    var footnotes = document.querySelectorAll('.footref');
    
    footnotes.forEach(function (footnote) {
      footnote.addEventListener('mouseover', function (event) {
        var noteId = this.getAttribute('href').substring(1);
        var note = document.getElementById(noteId);
        note.style.display = 'block';
        note.style.top = (event.pageY + 10) + 'px';
        note.style.left = (event.pageX + 10) + 'px';
      });

      footnote.addEventListener('mouseout', function () {
        var noteId = this.getAttribute('href').substring(1);
        var note = document.getElementById(noteId);
        note.style.display = 'none';
      });
    });
  });
\
