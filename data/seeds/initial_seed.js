/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'steve', password: '$2y$06$pV5wvFNstuV0mYqAomZSEeREI5gcXL1OjIcoRqi7yqw3xXqJWLqpm'},
    {id: 2, username: 'terry', password: '$2y$06$7MuVVZSX.y3tT3.aubCm2OyTFdb9IxI5xLEABgdAFJ/4iVQ6cCxaG'},
    // bob, foo
    {id: 3, username: 'bob', password: '$2y$06$dUVMA03hN.CsE2dOA5FC0.OyunFrgjLLkBWmPdhOCFKh0H.c8XtzS'}
  ]);
};
