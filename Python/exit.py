import pygame
import random

WIDTH, HEIGHT = 800, 600

class Exit:
    def __init__(self):
        self.width = 30
        self.height = 30
        self.color = (255, 255, 0) # 黄色
        self.rect = pygame.Rect(0, 0, self.width, self.height)
        self.reset_position()

    def reset_position(self):
        self.rect.x = random.randint(0, WIDTH - self.width)
        self.rect.y = random.randint(0, HEIGHT - self.height)

    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)
