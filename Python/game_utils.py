import random
from obstacle import Obstacle
from exit import Exit
from player import Player

WIDTH, HEIGHT = 800, 600

def generate_obstacles(num=30):
    return [Obstacle() for _ in range(num)]

def generate_exit(obstacles):
    exit = Exit()
    while True:
        exit.rect.x = random.randint(0, WIDTH - exit.width)
        exit.rect.y = random.randint(0, HEIGHT - exit.height)
        
        if all(not check_collision(exit.rect, obs.rect) for obs in obstacles):
            break
    
    return exit

def generate_player_position(player, obstacles, exit_point):
    player.reset_position()
    while True:
        if not any(check_collision(player.rect, obs.rect) for obs in obstacles) and \
           not check_collision(player.rect, exit_point.rect):
            break
        player.reset_position()
    return player

def check_collision(rect1, rect2):
    return rect1.colliderect(rect2)
