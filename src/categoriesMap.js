export const cMap = {
    1: 'Outdoors & Adventure',
    2: 'Tech',
    3: 'Family',
    4: 'Health & Wellness',
    5: 'Sports & Fitness',
    6: 'Learning',
    7: 'Photography',
    8: 'Food & Drink',
    9: 'Writing',
    10: 'Language & Culture',
    11: 'Music',
    12: 'Movements',
    13: 'LGBTQ',
    14: 'Film',
    15: 'Sci-Fi & Games',
    16: 'Beliefs',
    17: 'Arts',
    18: 'Book Clubs',
    19: 'Dance',
    20: 'Pets',
    21: 'Hobbies & Crafts',
    22: 'Fashion & Beauty',
    23: 'Social',
    24: 'Career & Business'
};

export let options = [];

for (var key in cMap) {
    options.push(
        {
            value: key,
            label: cMap[key]
        }
    );
}