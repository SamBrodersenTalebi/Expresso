//import express and create instance of express router
const express = require('express');

//Need access about specified employees from timesheet router => need to merge paramters 
//Want to be able to access employeeId paramter
const menuItemRouter = express.Router({mergeParams: true});

//import sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')


//router params
menuItemRouter.param('menuItemId',(req, res, next, menuItemId)=>{
    db.get('SELECT * FROM MenuItem WHERE MenuItem.id=$menuItemId',
    {
        $menuItemId:menuItemId
    },(error, menuItem)=>{
        if(error){
            next(error)
        }else if(menuItem){
            //attach to request object as menuItem
            req.menuItemId = menuItemId;
            //move on to next function 
            next();
        } else{
            res.sendStatus(404);
        }
    })
})

menuItemRouter.get('/', (req,res,next)=>{
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
    const values = {$menuId: req.params.menuId}
    db.all(sql, values, (error, rows)=>{
        if(error){
            next(error);
        } else{
            res.status(200).json({menuItems: rows})
        }
    })
});

menuItemRouter.post('/', (req,res,next)=>{
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.params.menuId;

    if(!name || !description || !inventory || !price){
        return res.sendStatus(400);
    }

    const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';

    const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: menuId
    };

    db.run(sql, values, function(error){
        if(error){
            next(error);
        } else{
            db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (error,row)=>{
                res.status(201).json({menuItem:row});
            })
        }
    })
});

//put handler 
menuItemRouter.put('/:menuItemId', (req, res, next)=>{
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.params.menuId;

    if(!name || !description || !inventory || !price){
        return res.sendStatus(400);
    }

    const sql = "UPDATE MenuItem SET name=$name, description=$description, inventory=$inventory, price=$price, menu_id=$menuId WHERE MenuItem.id = $menuItemId";
    const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: menuId,
        $menuItemId: req.params.menuItemId
    };

    db.run(sql, values, function(error){
        if (error){
            next(error);
        } else{
            db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
            (error, row) => {
              res.status(200).json({menuItem: row});
            });
        }
    })
})

menuItemRouter.delete('/:menuItemId', (req, res, next)=>{
    const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
    const value = {$menuItemId: req.params.menuItemId}

    db.run(sql,value, function(error){
        if(error){
            next(error);
        } else{
            res.sendStatus(204);
        }
    })
})
module.exports = menuItemRouter;