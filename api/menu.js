//import express and create instance of express router
const express = require('express');
const menuRouter = express.Router();

//import sqlite3
const sqlite3 = require('sqlite3');

//require menuItem
const menuItemRouter = require('./menuItem.js');

//check if process.env.TEST_DATABASE has been set, and if so load that database instead
//it will be used for testing
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//Mount timesheetRouter at /:employeeId/timesheets
menuRouter.use('/:menuId/menu-items', menuItemRouter);


//router params
menuRouter.param('menuId',(req, res, next, menuId)=>{
    db.get('SELECT * FROM Menu WHERE Menu.id=$menuId',
    {
        $menuId:menuId
    },(error, menu)=>{
        if(error){
            next(error)
        }else if(menu){
            //attach to request object as employee
            req.menu = menu;
            //move on to next function 
            next();
        } else{
            res.sendStatus(404);
        }
    })
})

menuRouter.get('/', (req,res,next)=>{
    const sql = 'SELECT * FROM Menu';
    db.all(sql, (error,rows)=>{
        if(error){
            next(error);
        } else{
            res.status(200).json({menus: rows})
        }
    })
});

menuRouter.post('/', (req, res, next)=>{
    const title = req.body.menu.title;
    if(!title){
        return res.sendStatus(400);
    }
    const sql = 'INSERT INTO Menu (title) VALUES($title)';
    const values = {$title:title};
    
    db.run(sql, values, function(error){
        if(error){
            next(error);
        } else{
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (error,row)=>{
                res.status(201).json({menu:row});
            })
        }
    })
});

menuRouter.get('/:menuId', (req, res, next)=>{
    res.status(200).json({menu:req.menu});
})

menuRouter.put('/:menuId', (req, res, next)=>{
    const title = req.body.menu.title;
    if(!title){
        return res.sendStatus(400);
    }
    const sql = 'UPDATE Menu SET title=$title WHERE Menu.id = $menuId';
    const values = {$title:title, $menuId: req.params.menuId};

    db.run(sql, values, function(error){
        if(error){
            next(error);
        } else{
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (error, row)=>{
                res.status(200).json({menu:row});
            })
        }
    })
});

menuRouter.delete('/:menuId', (req, res, next)=>{
    const menuItemSql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
    const menuItemValue = {$menuId: req.params.menuId};

    db.get(menuItemSql, menuItemValue, (error, row)=>{
        if(error){
            next(error);
        } else if(row){
            /*
            If the menu with the supplied menu ID has related menu items, 
            returns a 400 response.
            */
           return res.sendStatus(400); 
        } else{
            const sql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
            const value = {$menuId: req.params.menuId};
            db.run(sql, value, function(error){
                if (error){
                    next(error);
                } else{
                    res.sendStatus(204);
                }
            })
        }
    })

})

module.exports = menuRouter;