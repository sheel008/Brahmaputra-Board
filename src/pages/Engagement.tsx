import { User } from '@/types/user';
import { mockFeedback, mockAchievements } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Star, Trophy, Lock, CheckCircle, Plus } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

interface EngagementProps {
  currentUser: User;
}

export default function Engagement({ currentUser }: EngagementProps) {
  const getUserById = (id: string) => mockUsers.find(u => u.id === id);

  const achievements = mockAchievements.map(a => ({
    ...a,
    earned: a.earned && currentUser.id === '1' // Only show as earned for demo user
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Employee Engagement</h1>
        <p className="text-muted-foreground">Share feedback and view achievements</p>
      </div>

      <Tabs defaultValue="feedback" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Submit Feedback</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Peer</Button>
                  <Button variant="outline" size="sm">Self</Button>
                  <Button variant="outline" size="sm">Team</Button>
                  <Button variant="outline" size="sm">Project</Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <input 
                  type="text" 
                  placeholder="Brief subject..." 
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea 
                  placeholder="Share your feedback..." 
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  <span>Submit anonymously</span>
                </label>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold">Recent Feedback</h3>
            {mockFeedback.map(feedback => {
              const fromUser = getUserById(feedback.from);
              const toUser = feedback.to ? getUserById(feedback.to) : null;

              return (
                <Card key={feedback.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={fromUser?.avatar} />
                      <AvatarFallback>
                        {fromUser?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {feedback.anonymous ? 'Anonymous' : fromUser?.name}
                            </span>
                            {toUser && (
                              <>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-sm text-muted-foreground">{toUser.name}</span>
                              </>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {feedback.type}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm">{feedback.subject}</p>
                        </div>
                        {feedback.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{feedback.message}</p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(feedback.timestamp).toLocaleString()}
                        </p>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                      </div>

                      {feedback.replies && feedback.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 space-y-3">
                          {feedback.replies.map(reply => {
                            const replyUser = getUserById(reply.from);
                            return (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={replyUser?.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {replyUser?.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{replyUser?.name}</p>
                                  <p className="text-sm text-muted-foreground">{reply.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <Card 
                key={achievement.id} 
                className={`p-6 relative overflow-hidden ${
                  achievement.earned 
                    ? 'border-primary bg-gradient-to-br from-primary/5 to-transparent' 
                    : 'opacity-60'
                }`}
              >
                {achievement.earned && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                )}
                {!achievement.earned && (
                  <div className="absolute top-4 right-4">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    achievement.earned ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Trophy className={`h-10 w-10 ${
                      achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>

                  <h3 className="font-semibold mb-2">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>

                  {achievement.earned && achievement.earnedDate && (
                    <Badge variant="default" className="mb-3">
                      Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                    </Badge>
                  )}

                  <div className="w-full p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Criteria:</strong> {achievement.criteria}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
