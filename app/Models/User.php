<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role_id',
        'image',
    ];

    protected $appends = ['image_url'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image
            ? Storage::disk('public')->url($this->image)
            : null;
    }

    public function createdPersonalInfo()
    {
        return $this->hasMany(PersonalInfo::class, 'created_by');
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Permissions granted directly to this user, in addition to their role.
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'user_permissions',
            'user_id',
            'permission_id'
        );
    }

    public function isAdmin(): bool
    {
        return strtolower((string) $this->role?->key) === 'admin';
    }

    public function hasPermission(string $key): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        if ($this->role?->permissions?->contains('key', $key)) {
            return true;
        }

        return $this->permissions?->contains('key', $key) ?? false;
    }
}
