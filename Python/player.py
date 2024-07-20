import pygame

WIDTH, HEIGHT = 800, 600

class Player:
    def __init__(self):
        self.width = 30
        self.height = 30
        self.color = (0, 0, 0)
        self.speed = 5
        self.rect = pygame.Rect(0, 0, self.width, self.height)
        self.reset_position()

    def reset_position(self):
        self.rect.x = 100
        self.rect.y = 100

    def move(self, dx, dy):
        self.rect.x += dx
        self.rect.y += dy

    def update(self):
        # Handle wrapping around screen edges
        if self.rect.left < 0:
            self.rect.right = WIDTH
        if self.rect.right > WIDTH:
            self.rect.left = 0
        if self.rect.top < 0:
            self.rect.bottom = HEIGHT
        if self.rect.bottom > HEIGHT:
            self.rect.top = 0

    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)
