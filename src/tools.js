import randomcolor from 'randomcolor';

export function getColor(){
    return randomcolor({luminosity: 'bright', hue: 'random'});
}



