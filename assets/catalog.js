(() => {
  'use strict';
  const search = document.getElementById('product-search');
  const brandSearch = document.getElementById('brand-search');
  const brandSelect = document.getElementById('brand-select');
  const sections = [...document.querySelectorAll('.brand-section')];
  const buttons = [...document.querySelectorAll('.brand-button')];
  const reset = document.getElementById('reset-filters');
  const clear = document.getElementById('clear-search');
  const empty = document.getElementById('empty');
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[’‘]/g, "'").trim();
  let selectedBrand = '';
  function filterCatalog() {
    const query = normalize(search.value);
    let count = 0, brandCount = 0;
    sections.forEach(section => {
      const brand = section.dataset.brand;
      let sectionCount = 0;
      section.querySelectorAll('.product-card').forEach(card => {
        const match = (!selectedBrand || selectedBrand === brand) && (!query || normalize(card.dataset.name).includes(query) || normalize(brand).includes(query));
        card.hidden = !match;
        if (match) sectionCount++;
      });
      section.hidden = sectionCount === 0;
      section.querySelector('.count').textContent = `${sectionCount} ${sectionCount === 1 ? 'product' : 'products'}`;
      if (sectionCount) brandCount++;
      count += sectionCount;
    });
    document.getElementById('results-summary').textContent = `${count} ${count === 1 ? 'product' : 'products'} across ${brandCount} ${brandCount === 1 ? 'brand' : 'brands'}`;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.brand === selectedBrand)));
    brandSelect.value = selectedBrand;
    reset.hidden = !query && !selectedBrand;
    clear.hidden = !search.value;
    empty.hidden = count > 0;
  }
  function resetFilters() { search.value = ''; selectedBrand = ''; brandSearch.value = ''; filterBrands(); filterCatalog(); }
  function filterBrands() {
    const query = normalize(brandSearch.value);
    let matches = 0;
    buttons.forEach(button => {
      const show = !button.dataset.brand || normalize(button.dataset.brand).includes(query);
      button.hidden = !show;
      if (show && button.dataset.brand) matches++;
    });
    document.getElementById('no-brands').hidden = matches > 0;
  }
  search.addEventListener('input', filterCatalog);
  brandSearch.addEventListener('input', filterBrands);
  brandSelect.addEventListener('change', () => { selectedBrand = brandSelect.value; filterCatalog(); });
  buttons.forEach(button => button.addEventListener('click', () => { selectedBrand = selectedBrand === button.dataset.brand ? '' : button.dataset.brand; filterCatalog(); }));
  clear.addEventListener('click', () => { search.value = ''; filterCatalog(); search.focus(); });
  reset.addEventListener('click', resetFilters);
  document.getElementById('empty-reset').addEventListener('click', resetFilters);
  document.querySelectorAll('.product-image img').forEach(img => {
    const fallback = () => { img.closest('.product-image').classList.add('no-image'); img.hidden = true; };
    img.addEventListener('error', fallback);
    if (img.complete && !img.naturalWidth) fallback();
  });
  filterCatalog();
})();
