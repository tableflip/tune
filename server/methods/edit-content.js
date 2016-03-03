Meteor.methods({
  getField: function (page, key) {
    //TODO:
    // auth request
    // fetch from github and return
    let responses = [
      {
        content: 'Our content for a text field',
        type: 'text'
      },
      {
        content: 'Pellentesque iaculis perspiciatis tempora aliquid! Donec, eu interdum aliquip hymenaeos doloribus temporibus velit maxime cum aspernatur, officiis pariatur pretium tempora sed aptent blanditiis assumenda. Parturient mi accumsan nisl excepturi possimus? Eius praesentium voluptates? Illo. Culpa quasi nostrud fugiat eveniet exercitationem, condimentum varius! Eius ex. Volutpat natoque, justo vulputate? Omnis lorem, aut, enim porro egestas? Ex nullam ipsa do accumsan sunt! Cupiditate modi necessitatibus. Eiusmod, suscipit proident iure nesciunt, felis, mattis, soluta aut? Mollit minim accusantium, accusantium rerum, minim, id eaque modi unde. Officia habitasse, corporis aliquam ullamcorper sociis nec possimus, voluptatum eum aenean platea et tenetur cupiditate aliquet! Saepe, voluptates.',
        type: 'textarea'
      },
      {
        content: [
          'Item One',
          'Item Two',
          'Item Three',
          'Item Four',
          'Item Five'
        ],
        type: 'list'
      },
      {
        content: 'https://ucarecdn.com/assets/images/cloud.6b86b4f1d77e.jpg',
        type: 'img'
      },
      {
        content: [51.505, -0.09],
        type: 'map'
      }
    ]

    return responses[2]
  }
})
