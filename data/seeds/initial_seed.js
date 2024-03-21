/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'steve', password: '$2y$06$1fIxsBOkduzeJUipAMBK/eoY9uRVA95.2AqhdnrEa0HaL.chChZBG'},
    {id: 2, username: 'terry', password: '$2y$06$7MuVVZSX.y3tT3.aubCm2OyTFdb9IxI5xLEABgdAFJ/4iVQ6cCxaG'},
    {id: 3, username: 'bob', password: '$2y$06$Nk6oY8zvPdOEyjpNCFVKvODmLb7EemYOSXMYkB7MhSUPe48pK/gky'}
  ]);
};
