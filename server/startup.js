if (!Items.find().count()) {
  Items.insert({ text: 'foobar' })
  Items.insert({ text: 'hello' })
  Items.insert({ text: 'can you see me?' })
}
