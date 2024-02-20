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

// TODO: fix and add to server.ts
app.delete('/errands/:id', async (request, response) => {
  const idToDelete = request.params.id;

  try {
    const dataPath = path.join(__dirname, './data/errands.json');
    const errands = JSON.parse(await fs.promises.readFile(dataPath, 'utf8'));

    const updatedErrands = errands.filter((errand) => errand.id !== idToDelete);

    await fs.promises.writeFile(
      dataPath,
      JSON.stringify(updatedErrands),
      'utf8'
    );

    response.status(200).json({ message: 'Errand deleted.' });
  } catch (err) {
    console.error('Error deleting errand: ', err);
    response
      .status(500)
      .json({ message: 'Error deleting errand', error: err.message });
  }
});
