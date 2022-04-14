from manim import * 
 
class ExampleScene(Scene): 
   def construct(self):
       ellipse1 = Ellipse(width=5, height=5, color=BLUE, stroke_width=10).move_to(LEFT).move_to(RIGHT)
       ellipse2 = ellipse1.copy().set_color(color=RED).move_to(RIGHT)
       bool_ops_text = MarkupText("<u>Boolean Operation</u>").next_to(ellipse1, UP * 3)
       ellipse_group = Group(ellipse1, ellipse2, bool_ops_text).move_to(LEFT * 3)
       self.play(FadeIn(ellipse_group))