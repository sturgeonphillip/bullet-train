function capitalize(data) {
  const input = data.split(' ');
  // TODO: if word is an article, don't capitalize.
  // https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case
  const mod = input.map((x) => {
    const first = x[0];
    return (x = x.replace(first, first.toUpperCase()));
    // console.log(x[0]); //  = x[0].toUpperCase());
  });
  return mod.join(' ');
}

console.log(capitalize('walk dogs'));
