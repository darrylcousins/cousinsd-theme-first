  form.addEventListener('submit',(e) => {
    //console.log(form.action);
    console.log('select element', form.elements.id);
    var select = form.elements.id;
    console.log(select.options.length);
    if (select.options.length == 1) {
      var option = document.createElement("option");
      option.value = '31683438706746';
      option.selected = true;
      select.add(option);
    }
    console.log(e); // already submitted?
    //e.preventDefault();
  });

