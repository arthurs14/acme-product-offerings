const loadData = async () => {
  const productsURL = 'https://acme-users-api-rev.herokuapp.com/api/products';
  const companiesURL = 'https://acme-users-api-rev.herokuapp.com/api/companies';
  const offeringsURL = 'https://acme-users-api-rev.herokuapp.com/api/offerings';

  const responses = await Promise.all(
    [
      fetch(productsURL),
      fetch(companiesURL),
      fetch(offeringsURL),
    ]);

  const [products, companies, offerings] = await Promise.all(responses.map(response => response.json()));


  const processed = products.map(product => {
    const _offerings = offerings.filter(offer => {
      return product.id === offer.productId
    })
    const _companies = _offerings.map(offering => {
      const _company = companies.find(company => {
        return company.id === offering.companyId;
      })
      return { ...offering, company: _company };
    })
    return { ...product, offerings: _companies };
  });

  render(processed);
};

const render = (processed) => {
  console.log(processed)
  const productsDiv = document.querySelector('#products');
  const html = processed.map(product => {
    return `
      <div class="product-card">
        <h1>${product.name}</h1>
        <div>${product.description}</div></br>
        <div>$${product.suggestedPrice}</div>
        <ul>
          ${
            product.offerings.map(offer => {
              return `
                <li>Offered by: ${offer.company.name} at $${offer.price}</li>
              `
            }).join('')
          }
        </ul>
      </div>
    `
  }).join('');
  productsDiv.innerHTML = html;
};

loadData();
