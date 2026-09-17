from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_code', models.CharField(help_text='Unique course code identifier, e.g., CS101', max_length=20, unique=True)),
                ('course_name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('instructor', models.CharField(max_length=100)),
                ('department', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=100)),
                ('duration', models.PositiveIntegerField(help_text='Duration value, must be greater than 0')),
                ('duration_unit', models.CharField(choices=[('Hours', 'Hours'), ('Days', 'Days'), ('Weeks', 'Weeks'), ('Months', 'Months')], default='Weeks', max_length=20)),
                ('credits', models.PositiveIntegerField(help_text='Course credit points, must be greater than 0')),
                ('fee', models.DecimalField(decimal_places=2, help_text='Tuition fee, cannot be negative', max_digits=10)),
                ('level', models.CharField(choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')], default='Beginner', max_length=20)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('max_students', models.PositiveIntegerField(help_text='Maximum capacity of students')),
                ('status', models.CharField(choices=[('Upcoming', 'Upcoming'), ('Active', 'Active'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Upcoming', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Course',
                'verbose_name_plural': 'Courses',
                'ordering': ['-id'],
            },
        ),
    ]
