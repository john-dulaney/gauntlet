"use strict";

var Gauntlet = function (global) {
  const _internal = gutil.privy.init(); // Private store

  /*
    Base weapon object that all other specific weapons will
    have as their prototype.
  */
  const Weapon = gutil.compose(Object.create(null), gutil.ObjectExtensions);

  Weapon.property("id", "nothing").property("label", "bare hands")
        .property("hands", 2).property("base_damage", 1)
        .property("ranged", false).property("poisoned", false);
  
  // Swing method modifies the damage based on wielder strength
  Weapon.def("swing", function (modifier) {
    this.strength_modifier = modifier;
    return this;
  });

  Weapon.def("at", function (target) {
    // Calculate base weapon damage
    let damage = Math.round(Math.random() * this.base_damage + 1);

    // Calculate if a critical hit was made


    // Add strength modifier and reduce by target's armor
    damage += Math.round(this.strength_modifier - target.protection);

    // Minimum damage is 0
    damage = (damage < 0) ? 0 : damage;

    // Reduce target's health
    target.health -= damage;

    return {
      weapon: this.label,
      target: target.name,
      damage: damage
    };
  });

  Weapon.def("toString", function () {
    return `${this.label}`;
  });

  // Armory object contains all weapons loaded from JSON file
  const Armory = gutil.compose(Object.create(null), gutil.ObjectExtensions);

  Armory.def("init", function () {
    _internal(this).weapon_list = [];
    return this;
  });

  // Method to return the entire collection of weapons
  Armory.def("weapons", function () {
    return _internal(this).weapon_list;
  });

  // Method to load the weapons from the JSON file
  Armory.def("load", function () {
    return new Promise((resolve, reject) => {
      $.ajax({url: "./data/weapons.json"}).done(response => {
        // Iterate all weapon objects in the JSON file
        response.weapons.each(weapon =>
          _internal(this).weapon_list.push( gutil.compose(Weapon, weapon)) );

        // Resolve the weapon loading promise with the weapon list
        resolve(_internal(this).weapon_list);

      }).fail((xhr, error, msg) => {
        reject(msg);
      });
    });
  });

  global.Armory = Armory.init();
  return global;

}(Gauntlet || {});
