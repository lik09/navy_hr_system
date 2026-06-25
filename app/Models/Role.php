<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'name', 'name_kh', 'key', 'description' ,'status'
    ];

    // Relationship ទៅ Permission តាមរយៈ RolePermission
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permissions',  // pivot table
            'role_id',           // foreign key នៅ pivot
            'permission_id'      // foreign key ទៅ permissions
        );
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

}
