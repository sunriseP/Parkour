import pygame
import sys
from player import Player
from obstacle import Obstacle
from exit import Exit
from game_utils import generate_obstacles, generate_exit, generate_player_position, check_collision

pygame.init()

WIDTH, HEIGHT = 800, 600
BACKGROUND_COLOR = (255, 255, 255)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("跑酷游戏")

def create_initial_game_state():
    player = Player()
    obstacles = generate_obstacles()
    exit_point = generate_exit(obstacles)
    return player, obstacles, exit_point

player, obstacles, exit_point = create_initial_game_state()

def reset_game():
    global player, obstacles, exit_point
    player, obstacles, exit_point = create_initial_game_state()

def game_loop():
    global player, obstacles, exit_point

    clock = pygame.time.Clock()
    game_over = False
    game_won = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_p:
                    while True:
                        event = pygame.event.wait()
                        if event.type == pygame.KEYDOWN and event.key == pygame.K_p:
                            break

        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            player.move(-player.speed, 0)
        if keys[pygame.K_RIGHT]:
            player.move(player.speed, 0)
        if keys[pygame.K_UP]:
            player.move(0, -player.speed)
        if keys[pygame.K_DOWN]:
            player.move(0, player.speed)

        player.update()

        if any(check_collision(player.rect, obs.rect) for obs in obstacles):
            game_over = True

        if check_collision(player.rect, exit_point.rect):
            game_won = True

        if game_over:
            print("游戏结束")
            reset_game()
            game_over = False
        elif game_won:
            print("通关!")
            reset_game()
            game_won = False

        screen.fill(BACKGROUND_COLOR)
        player.draw(screen)
        for obs in obstacles:
            obs.draw(screen)
        exit_point.draw(screen)

        pygame.display.flip()
        clock.tick(30)

if __name__ == "__main__":
    game_loop()
