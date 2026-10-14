const assert = require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const houses=require('./dist/data.js');
const calc=require('./dist/model.js');
const houseRecords=houses.filter(h=>h.type==='house');
assert.equal(houseRecords.length,19);
assert.deepEqual(houseRecords.map(h=>h.id),['101','102','201','202','203','204','301','302','303','304','401','402','403','404','405','410','502','503','504']);
assert.deepEqual([1,2,3,4,5].map(zone=>houseRecords.filter(h=>h.zone===zone).length),[2,4,4,6,3]);
for(const h of houseRecords){
  const expected=h.id==='410'||h.id==='502'?[2200,660,1540,9,3,2]:h.id==='503'||h.id==='504'?[1500,450,1050,6,2,2]:[500,150,350,2,1,1];
  assert.deepEqual([h.price,h.discount,h.netPrice,h.capacity,h.bedrooms,h.bathrooms],expected);
  assert.equal(h.price-h.discount,h.netPrice);
}
assert.equal(new Set(houses.map(h=>h.id)).size,houses.length);
for(const h of houses){assert(h.x>0&&h.x<1&&h.y>0&&h.y<1);for(const p of h.photos)assert(fs.existsSync(path.join(__dirname,'dist',p.src)));}
assert.deepEqual(calc.houses(houses,['401','402','403','404'],8,1),{count:4,total:2000,perPerson:250,capacity:8,bathrooms:4,bedrooms:4,enough:true});
assert.equal(calc.houses(houses,['502'],8,2).total,4400);
assert.equal(calc.houses(houses,['502'],10,1).enough,false);
assert.equal(calc.houses(houses,['502','502'],8,1).total,2200);
assert.equal(calc.houses(houses,[],8,1).total,0);
assert.equal(calc.houses(houses,['401','402','403','404'],8,2,true).total,2800);
assert.equal(calc.houses(houses,['502','502'],8,2,true).total,3080);
assert.deepEqual(calc.houses(houses,['503','504'],12,2,true),{count:2,total:4200,perPerson:350,capacity:12,bathrooms:4,bedrooms:4,enough:true});
assert.equal(calc.houses(houses,['101','102','201','202','203','204','302'],14,1).total,3500);
assert.equal(calc.houses(houses,[],8,1,true).total,0);
assert.deepEqual(calc.camping(8,1),{tents:4,area:240,gear:400,min:1280,max:1540});
assert.deepEqual(calc.camping(8,2),{tents:4,area:480,gear:800,min:2560,max:3080});
assert.equal(calc.camping(3,1).tents,2);
assert.equal(calc.camping(8,1,{rent:false}).min,240);
assert.equal(calc.camping(8,1,{bag:false,mat:false,pillow:false,ground:false}).min,640);
assert.equal(calc.camping(8,1,{pillow:true}).min,1360);
assert.equal(calc.camping(8,1,{ground:false}).min,1040);
assert.equal(calc.integer(-5,8,99),1);
assert.equal(calc.integer(999,8,99),99);
assert.equal(calc.integer('bad',8,99),8);
assert.equal(calc.integer(1.8,8,99),2);
console.log('Passed: 19 house records, workbook rates and capacities, unique map points, photo assets, capacity, duplicate selection, regular/net nightly rates, odd tent counts, equipment and nonduplicated ground fees.');
